import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatPostDate, tagSlug, type BlogPost } from "@/data/blog";
import { portfolioContent } from "@/data/portfolio";
import { BOOKING_URL } from "@/data/site-config";

type BlogListingProps = {
  posts: BlogPost[];
  page?: number;
  totalPages?: number;
  selectedTag?: string;
};

export function BlogListing({ posts, page = 1, totalPages = 1, selectedTag }: BlogListingProps) {
  return (
    <main className="blog-page">
      <SiteHeader brand={portfolioContent.brand} />
      <section className="blog-hero" aria-labelledby="blog-title">
        <p className="eyebrow"><span className="eyebrow-dot" />A journal on making useful products</p>
        {selectedTag ? <h1 id="blog-title">Posts tagged <em>{selectedTag}</em></h1> : <h1 id="blog-title">Ideas into <em>impact.</em></h1>}
        <p>Practical notes on product discovery, choosing what matters, working with engineering and building with AI.</p>
      </section>

      <section className="blog-grid" aria-label="Published articles">
        {posts.map((post) => (
          <article className="blog-card" key={post.slug}>
            {post.image && <Link className="blog-card-image" href={`/blog/${encodeURIComponent(post.slug)}/`} tabIndex={-1} aria-hidden="true"><img src={post.image.src} alt="" /></Link>}
            <div className="blog-card-copy">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <h2><Link href={`/blog/${encodeURIComponent(post.slug)}/`}>{post.title}</Link></h2>
              <p>{post.description}</p>
              <Link className="blog-read-link" href={`/blog/${encodeURIComponent(post.slug)}/`}>Read article <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        ))}
      </section>

      {totalPages > 1 && <nav className="blog-pagination" aria-label="Blog pages">
        {page > 1 && <Link rel="prev" href={page === 2 ? "/blog/" : `/blog/page/${page - 1}/`}>← Previous</Link>}
        <span aria-current="page">Page {page} of {totalPages}</span>
        {page < totalPages && <Link rel="next" href={`/blog/page/${page + 1}/`}>Next →</Link>}
      </nav>}

      {selectedTag && <p className="blog-tags-back"><Link href="/blog/">View all articles</Link></p>}
      <footer className="blog-footer">
        <Link href="/">← Back to Vijayebhava</Link>
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

export function TagPageListing({ posts, tag }: { posts: BlogPost[]; tag: string }) {
  const selectedTag = posts.flatMap((post) => post.tags).find((name) => tagSlug(name) === tag) ?? tag;
  return <BlogListing posts={posts} selectedTag={selectedTag} />;
}
