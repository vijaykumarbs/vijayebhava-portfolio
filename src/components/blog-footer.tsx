import Link from "next/link";
import { portfolioContent } from "@/data/portfolio";
import { BOOKING_URL } from "@/data/site-config";

export function BlogFooter({ note }: { note: string }) {
  return (
    <footer className="blog-footer">
      <Link href="/">← Back to Vijayebhava</Link>
      <div className="blog-footer-links">
        <a className="blog-footer-booking" href={BOOKING_URL} target="_blank" rel="noopener">Book a call</a>
        <a href={portfolioContent.contact.whatsappUrl} target="_blank" rel="noopener">WhatsApp</a>
        <a href={portfolioContent.contact.linkedinUrl} target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <span>{note}</span>
    </footer>
  );
}
