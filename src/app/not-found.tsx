import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { portfolioContent } from "@/data/portfolio";
import { BOOKING_URL } from "@/data/site-config";

export default function NotFound() {
  return (
    <main className="blog-page not-found-page">
      <SiteHeader brand={portfolioContent.brand} />
      <section className="blog-hero" aria-labelledby="not-found-title">
        <p className="eyebrow"><span className="eyebrow-dot" />404 · PAGE NOT FOUND</p>
        <h1 id="not-found-title">This page isn’t here.</h1>
        <p>Return to the home page or use Let&apos;s Talk.</p>
        <div className="hero-actions">
          <Link className="button-primary" href="/">Back to home <span aria-hidden="true">↗</span></Link>
          <a className="button-text" href={BOOKING_URL} target="_blank" rel="noopener">Let&apos;s Talk <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <footer className="blog-footer">
        <Link href="/">← Back to Vijayebhava</Link>
        <div className="blog-footer-links">
          <a className="blog-footer-booking" href={BOOKING_URL} target="_blank" rel="noopener">Let&apos;s Talk</a>
          <a href={portfolioContent.contact.whatsappUrl} target="_blank" rel="noopener">WhatsApp</a>
          <a href={portfolioContent.contact.linkedinUrl} target="_blank" rel="noopener">LinkedIn</a>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
