import Link from "next/link";
import { portfolioContent } from "@/data/portfolio";
import { SocialLink } from "@/components/social-links";

export function BlogFooter({ note }: { note: string }) {
  return (
    <footer className="blog-footer">
      <Link href="/">← Back to Vijayebhava</Link>
      <div className="blog-footer-links">
        <SocialLink network="whatsapp" href={portfolioContent.contact.whatsappUrl} placement="blog-footer" />
        <SocialLink network="linkedin" href={portfolioContent.contact.linkedinUrl} placement="blog-footer" />
      </div>
      <span>{note}</span>
    </footer>
  );
}
