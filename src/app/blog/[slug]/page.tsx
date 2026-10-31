import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatPostDate, getPublishedPosts } from "@/data/blog";
import { portfolioContent } from "@/data/portfolio";
import { BOOKING_URL, SITE_AUTHOR } from "@/data/site-config";

export const dynamicParams = false;

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "_empty" }];
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: "Article not found | Vijayebhava", robots: { index: false, follow: false } };

  const description = post.excerpt || `An article by Vijayebhava: ${post.title}`;
  return {
    title: `${post.title} | Vijayebhava`,
    description,
    alternates: { canonical: `/blog/${encodeURIComponent(post.slug)}/` },
    openGraph: {
      title: post.title,
      description,
      url: `https://vijayebhava.com/blog/${encodeURIComponent(post.slug)}/`,
      siteName: "Vijayebhava",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
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
  const { posts } = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: `https://vijayebhava.com/blog/${encodeURIComponent(post.slug)}/`,
    author: { "@type": "Person", name: SITE_AUTHOR },
    publisher: { "@type": "Organization", name: "Vijayebhava", url: "https://vijayebhava.com/" },
    ...(post.image ? { image: post.image.src } : {}),
  };

  return (
    <main className="blog-page blog-post-page">
      <SiteHeader brand={portfolioContent.brand} />
      <article className="blog-article">
        <Link className="blog-back-link" href="/blog/">← All articles</Link>
        <header className="blog-article-header">
          <p className="blog-eyebrow">PRODUCT NOTES</p>
          <h1>{post.title}</h1>
          <p className="blog-article-excerpt">{post.excerpt}</p>
          <div className="blog-byline"><span>{SITE_AUTHOR}</span><time dateTime={post.date}>{formatPostDate(post.date)}</time></div>
        </header>
        {post.image && <img className="blog-featured-image" src={post.image.src} alt={post.image.alt} />}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="blog-article-end">
          <Link href="/blog/">More product notes <span aria-hidden="true">↗</span></Link>
          <a className="button-primary blog-article-booking" href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
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
