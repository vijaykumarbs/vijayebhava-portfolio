import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatPostDate, getPublishedPosts } from "@/data/blog";
import { portfolioContent } from "@/data/portfolio";

export const dynamicParams = false;

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "_wordpress-setup" }];
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: "WordPress setup | Vijayebhava", robots: { index: false, follow: false } };

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
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { posts } = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post && slug !== "_wordpress-setup") notFound();

  if (!post) {
    return (
      <main className="blog-page blog-post-page">
        <SiteHeader brand={portfolioContent.brand} whatsappUrl={portfolioContent.contact.whatsappUrl} />
        <article className="blog-article blog-setup-article">
          <a className="blog-back-link" href="/blog/">← All articles</a>
          <p className="blog-eyebrow">WORDPRESS CONNECTION</p>
          <h1>Connect WordPress to publish articles.</h1>
          <p className="blog-article-excerpt">The blog is ready. Once WordPress is reachable and has a published post, rebuilding the site creates the article pages here.</p>
        </article>
      </main>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: `https://vijayebhava.com/blog/${encodeURIComponent(post.slug)}/`,
    author: { "@type": "Person", name: "Vijayebhava" },
    publisher: { "@type": "Organization", name: "Vijayebhava", url: "https://vijayebhava.com/" },
    ...(post.image ? { image: post.image.src } : {}),
  };

  return (
    <main className="blog-page blog-post-page">
      <SiteHeader brand={portfolioContent.brand} whatsappUrl={portfolioContent.contact.whatsappUrl} />
      <article className="blog-article">
        <a className="blog-back-link" href="/blog/">← All articles</a>
        <header className="blog-article-header">
          <p className="blog-eyebrow">PRODUCT NOTES</p>
          <h1>{post.title}</h1>
          <p className="blog-article-excerpt">{post.excerpt}</p>
          <div className="blog-byline"><span>Vijayebhava</span><time dateTime={post.date}>{formatPostDate(post.date)}</time></div>
        </header>
        {post.image && <img className="blog-featured-image" src={post.image.src} alt={post.image.alt} />}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="blog-article-end"><a href="/blog/">More product notes <span aria-hidden="true">↗</span></a></div>
      </article>
      <footer className="blog-footer">
        <a href="/">← Back to Vijayebhava</a>
        <span>PRODUCT THINKING · PRACTICAL PROGRESS</span>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </main>
  );
}
