import { getPublishedPosts, postUrl } from "@/data/blog";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const latest = posts[0]?.updated || posts[0]?.date || new Date().toISOString();
  const items = posts.map((post) => {
    const url = postUrl(post.slug);
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
  }).join("\n");
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Vijayebhava Product Notes</title>
    <link>https://vijayebhava.com/blog/</link>
    <description>Practical notes on product discovery, choosing what matters, working with engineering and building with AI.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(feed, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
