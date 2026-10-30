import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { formatPostDate, getPublishedPosts } from "@/data/blog";
import { portfolioContent } from "@/data/portfolio";
import { BOOKING_URL } from "@/data/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const { posts } = await getPublishedPosts();
  const hasArticles = posts.length > 0;
  return {
    title: "Product Notes & Articles | Vijayebhava",
    description: "Notes on product discovery, prioritisation, AI-enabled products and practical product management.",
    alternates: { canonical: "/blog/" },
    robots: { index: hasArticles, follow: hasArticles },
    openGraph: {
      title: "Product Notes & Articles | Vijayebhava",
      description: "Notes on product discovery, prioritisation, AI-enabled products and practical product management.",
      url: "https://vijayebhava.com/blog/",
      siteName: "Vijayebhava",
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Vijayebhava — Make the complex clear. Build what matters." }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  };
}

export default async function BlogIndexPage() {
  const { posts } = await getPublishedPosts();

  return (
    <main className="blog-page">
      <SiteHeader brand={portfolioContent.brand} />
      <section className="blog-hero">
        <p className="eyebrow"><span className="eyebrow-dot" />A journal on making useful products</p>
        <h1>Ideas into <em>impact.</em></h1>
        <p>Practical notes on product discovery, choosing what matters, working with engineering and building with AI.</p>
      </section>

      {posts.length > 0 && (
        <section className="blog-grid" aria-label="Published articles">
          {posts.map((post) => (
            <article className="blog-card" key={post.id}>
              {post.image && <a className="blog-card-image" href={`/blog/${encodeURIComponent(post.slug)}/`} tabIndex={-1} aria-hidden="true"><img src={post.image.src} alt="" /></a>}
              <div className="blog-card-copy">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <h2><a href={`/blog/${encodeURIComponent(post.slug)}/`}>{post.title}</a></h2>
                <p>{post.excerpt || "A note on product thinking and practical progress."}</p>
                <a className="blog-read-link" href={`/blog/${encodeURIComponent(post.slug)}/`}>Read article <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="blog-footer">
        <a href="/">← Back to Vijayebhava</a>
        <div className="blog-footer-links">
          <a className="blog-footer-booking" href={BOOKING_URL} target="_blank" rel="noopener">Book a call</a>
          <a href={portfolioContent.contact.whatsappUrl} target="_blank" rel="noopener">WhatsApp</a>
          <a href={portfolioContent.contact.linkedinUrl} target="_blank" rel="noopener">LinkedIn</a>
        </div>
        <span>PRODUCT THINKING · PRACTICAL PROGRESS</span>
      </footer>
    </main>
  );
}
