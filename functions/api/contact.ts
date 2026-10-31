interface ContactEnvironment {
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  RESEND_API_KEY: string;
  CONTACT_RATE_LIMIT_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options: { expirationTtl: number }): Promise<void>;
  };
}

interface ContactFields {
  name: string;
  email: string;
  message: string;
  website: string;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "Strict-Transport-Security": "max-age=63072000",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  });
}

function readField(form: FormData, field: keyof ContactFields): string {
  const value = form.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

async function rateLimitKey(ipAddress: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ipAddress));
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `contact:${hash}`;
}

async function allowMessage(kv: ContactEnvironment["CONTACT_RATE_LIMIT_KV"], ipAddress: string): Promise<boolean> {
  const key = await rateLimitKey(ipAddress || "unknown");
  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - 3600;
  const stored = await kv.get(key);
  const timestamps = stored ? JSON.parse(stored) as unknown : [];
  const recent = Array.isArray(timestamps)
    ? timestamps.filter((timestamp): timestamp is number => typeof timestamp === "number" && timestamp > cutoff)
    : [];

  if (recent.length >= 5) return false;

  recent.push(now);
  await kv.put(key, JSON.stringify(recent), { expirationTtl: 3900 });
  return true;
}

export async function onRequestPost({ request, env }: { request: Request; env: ContactEnvironment }): Promise<Response> {
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return jsonResponse({ error: "Request not allowed" }, 403);
      }
    } catch {
      return jsonResponse({ error: "Request not allowed" }, 403);
    }
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: "Please check your name, email and message." }, 422);
  }

  const fields: ContactFields = {
    name: readField(form, "name"),
    email: readField(form, "email"),
    message: readField(form, "message"),
    website: readField(form, "website"),
  };

  if (fields.website) return jsonResponse({ ok: true });

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);
  if (
    !fields.name || byteLength(fields.name) > 100 ||
    !validEmail || byteLength(fields.email) > 254 ||
    !fields.message || byteLength(fields.message) > 2000
  ) {
    return jsonResponse({ error: "Please check your name, email and message." }, 422);
  }

  try {
    const ipAddress = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!(await allowMessage(env.CONTACT_RATE_LIMIT_KV, ipAddress))) {
      return jsonResponse({ error: "Please wait a while before sending another message." }, 429);
    }

    const safeName = fields.name.replace(/[\r\n]+/g, " ");
    const body = `Name: ${safeName}\nEmail: ${fields.email}\n\nMessage:\n${fields.message}\n`;
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        subject: `New website message from ${safeName}`,
        reply_to: fields.email,
        text: body,
      }),
    });

    if (!emailResponse.ok) {
      return jsonResponse({ error: "Message could not be sent right now. Please email me directly." }, 500);
    }

    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ error: "Message could not be sent right now. Please email me directly." }, 500);
  }
}
