"use client";

import { useEffect, useState } from "react";

const successMessages = [
  "Good software starts with a clear problem. Small steps turn it into something useful.",
  "The best technology makes hard things feel simpler. Every useful idea starts with a question.",
  "Build with curiosity; refine with feedback. Progress is a series of thoughtful iterations.",
];

export function FloatingTalkButton() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll(".hero-actions .button-primary, .contact-actions .button-primary");
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      setHidden(entries.some((entry) => entry.isIntersecting));
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
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
      setStatus(`Thanks — I’ll get back to you soon. ${successMessages[Math.floor(Math.random() * successMessages.length)]}`);
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="contact-form-wrap">
      <form className="contact-form" action="/api/contact" method="post" onSubmit={submit}>
        <label>Name<input name="name" autoComplete="name" maxLength={100} required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label>Short message<textarea name="message" maxLength={2000} required /></label>
        <div className="contact-form-hp" aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="button-primary" type="submit" disabled={sending}>Send message <span aria-hidden="true">↗</span></button>
        <p className="contact-form-status" role="status" aria-live="polite" data-state={state}>{status}</p>
      </form>
    </div>
  );
}
