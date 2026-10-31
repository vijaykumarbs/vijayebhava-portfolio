"use client";

import { useEffect, useState } from "react";

export function FloatingTalkButton() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = document.querySelectorAll(".hero-actions .button-primary, .contact-actions .button-primary");
    const updateVisibility = () => {
      const visible = Array.from(targets).some((target) => {
        const rect = target.getBoundingClientRect();
        const style = getComputedStyle(target);
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0
          && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      });
      setHidden(visible);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return <a className="floating-talk button-primary" href="#contact" aria-label="Let’s Talk" hidden={hidden}>Let’s Talk <span aria-hidden="true">↗</span></a>;
}

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [state, setState] = useState<"success" | "error" | "">("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setStatus("Sending…");
    setState("");
    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => body.append(key, String(value)));
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not send your message. Please try again.");
      form.reset();
      setState("success");
      setStatus("Thanks — I’ll get back to you soon.");
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="contact-form-wrap">
      {state === "success" ? <p className="contact-form-success" role="status">{status}</p> : <form className="contact-form" action="/api/contact" method="post" onSubmit={submit}>
        <label>Name<input name="name" autoComplete="name" maxLength={100} required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label>Short message<textarea name="message" maxLength={2000} required /></label>
        <div className="contact-form-hp" aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="button-primary" type="submit" disabled={sending}>Send message <span aria-hidden="true">↗</span></button>
        <p className="contact-form-status" role="status" aria-live="polite" data-state={state}>{status}</p>
      </form>}
    </div>
  );
}
