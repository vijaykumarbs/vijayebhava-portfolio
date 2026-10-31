import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { formatPostDate, getPublishedPosts, tagSlug } from "@/data/blog";
import { portfolioContent } from "@/data/portfolio";
import { BOOKING_URL, SITE_AUTHOR } from "@/data/site-config";

export const dynamicParams = false;

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: "Article not found | Vijayebhava", robots: { index: false, follow: false } };

  const canonicalUrl = post.canonicalUrl || `https://vijayebhava.com/blog/${encodeURIComponent(post.slug)}/`;
  return {
    title: `${post.title} | Vijayebhava`,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: "Vijayebhava",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      ...(post.image ? { images: [{ url: post.image.src, alt: post.image.alt }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      images: [post.image?.src || "/og-image.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  const relatedPosts = post.tags.length
    ? posts.filter((item) => item.slug !== post.slug && item.tags.some((tag) => post.tags.includes(tag))).slice(0, 3)
    : [];
  const cta = post.cta || { label: "Book a call", url: BOOKING_URL };
  const canonicalUrl = post.canonicalUrl || `https://vijayebhava.com/blog/${encodeURIComponent(post.slug)}/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Person", name: SITE_AUTHOR },
    publisher: { "@type": "Organization", name: "Vijayebhava", url: "https://vijayebhava.com/" },
    ...(post.tags.length ? { keywords: post.tags } : {}),
    ...(post.image ? { image: post.image.src } : {}),
  };
  const externalCta = /^https?:\/\//i.test(cta.url);

  return (
    <main className="blog-page blog-post-page">
      <SiteHeader brand={portfolioContent.brand} />
      <article className="blog-article">
        <Link className="blog-back-link" href="/blog/">← All articles</Link>
        <header className="blog-article-header">
          <p className="blog-eyebrow">PRODUCT NOTES</p>
          <h1>{post.title}</h1>
          <p className="blog-article-excerpt">{post.description}</p>
          <div className="blog-byline"><span>{SITE_AUTHOR}</span><time dateTime={post.date}>{formatPostDate(post.date)}</time></div>
          {post.tags.length > 0 && <div className="blog-tags" aria-label="Article topics">{post.tags.map((tag) => <Link href={`/blog/tags/${tagSlug(tag)}/`} key={tag}>{tag}</Link>)}</div>}
        </header>
        {post.image && <img className="blog-featured-image" src={post.image.src} alt={post.image.alt} />}
        <MarkdownContent tree={post.content} />
        {relatedPosts.length > 0 && <section className="related-posts" aria-labelledby="related-posts-title">
          <h2 id="related-posts-title">Related posts</h2>
          <ul>{relatedPosts.map((related) => <li key={related.slug}><Link href={`/blog/${encodeURIComponent(related.slug)}/`}>{related.title}</Link></li>)}</ul>
        </section>}
        <div className="blog-article-end">
          <Link href="/blog/">More product notes <span aria-hidden="true">↗</span></Link>
          <a className="button-primary blog-article-booking" href={cta.url} target={externalCta ? "_blank" : undefined} rel={externalCta ? "noopener" : undefined}>{cta.label} <span aria-hidden="true">↗</span></a>
        </div>
      </article>
      <footer className="blog-footer">
        <Link href="/">← Back to Vijayebhava</Link>
        <div className="blog-footer-links">
          <a className="blog-footer-booking" href={BOOKING_URL} target="_blank" rel="noopener">Book a call</a>
          <a href={portfolioContent.contact.whatsappUrl} target="_blank" rel="noopener">WhatsApp</a>
          <a href={portfolioContent.contact.linkedinUrl} target="_blank" rel="noopener">LinkedIn</a>
        </div>
        <span>PRODUCT THINKING · PRACTICAL PROGRESS</span>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
