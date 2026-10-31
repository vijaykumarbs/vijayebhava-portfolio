import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new-post -- "Your article title"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

if (!slug) {
  console.error("The title must include at least one letter or number.");
  process.exit(1);
}

const directory = join(process.cwd(), "content", "blog");
const destination = join(directory, `${slug}.md`);
if (existsSync(destination)) {
  console.error(`A post already exists at content/blog/${slug}.md`);
  process.exit(1);
}

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

mkdirSync(directory, { recursive: true });
writeFileSync(destination, `---\ntitle: ${JSON.stringify(title)}\nslug: ${slug}\ndate: "${today}"\ndescription: "TODO(Vijay): write a concise description."\ntags:\n  - "TODO(Vijay): add a tag"\nimageAlt: ""\ndraft: true\n---\n\nTODO(Vijay): write the article.\n`);
console.log(`Created content/blog/${slug}.md`);
