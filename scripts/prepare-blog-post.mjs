import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const markdown = process.env.POST_MARKDOWN;

if (typeof markdown !== "string" || !markdown.trim()) {
  console.error("Paste a complete Markdown article, including its frontmatter.");
  process.exit(1);
}

if (Buffer.byteLength(markdown, "utf8") > 60_000) {
  console.error("The Markdown article is too large for the publishing form (60,000 bytes maximum).");
  process.exit(1);
}

let frontmatter;
let body;
try {
  ({ data: frontmatter, content: body } = matter(markdown));
} catch (error) {
  console.error(`Could not parse Markdown frontmatter: ${error.message}`);
  process.exit(1);
}

const slug = frontmatter.slug;
if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Frontmatter must include a slug using lowercase letters, numbers, and hyphens.');
  process.exit(1);
}

if (frontmatter.draft !== false) {
  console.error('Set frontmatter "draft" to false before publishing.');
  process.exit(1);
}

if (!body.trim()) {
  console.error("The article body cannot be empty.");
  process.exit(1);
}

const directory = join(process.cwd(), "content", "blog");
const fileName = `${slug}.md`;
const destination = join(directory, fileName);
if (existsSync(destination)) {
  console.error(`A post already exists at content/blog/${fileName}`);
  process.exit(1);
}

mkdirSync(directory, { recursive: true });
writeFileSync(destination, markdown.endsWith("\n") ? markdown : `${markdown}\n`, { flag: "wx" });
console.log(fileName);
