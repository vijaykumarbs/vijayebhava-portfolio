import { randomUUID } from "node:crypto";
import { writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parsePost } from "@/data/blog";

const directory = join(process.cwd(), "content", "blog");
const files: string[] = [];

async function fixture(fields: string) {
  const slug = `validator-${randomUUID()}`;
  const fileName = `${slug}.md`;
  files.push(join(directory, fileName));
  await writeFile(join(directory, fileName), `---\n${fields.replaceAll("{{slug}}", slug)}\n---\nTest body.\n`);
  return { slug, fileName };
}

function validFields(date = "2026-01-01") {
  return `title: "Validation fixture"\nslug: "{{slug}}"\ndate: "${date}"\ndescription: "Fixture description"\ntags: []\ndraft: false`;
}

afterEach(async () => {
  await Promise.all(files.splice(0).map((file) => rm(file, { force: true })));
});

describe("blog frontmatter validation", () => {
  it("accepts a valid published post", async () => {
    const { slug, fileName } = await fixture(validFields());
    const result = await parsePost(fileName);
    expect(result.publishCandidate).toBe(true);
    expect(result.post?.slug).toBe(slug);
  });

  it("rejects a missing required field", async () => {
    const fields = validFields().replace('title: "Validation fixture"\n', "");
    const { fileName } = await fixture(fields);
    await expect(parsePost(fileName)).rejects.toThrow('frontmatter field "title" must be a non-empty string.');
  });

  it("rejects a slug that does not match its filename", async () => {
    const { fileName } = await fixture(validFields().replace('slug: "{{slug}}"', 'slug: "different-slug"'));
    await expect(parsePost(fileName)).rejects.toThrow("filename must match the frontmatter slug.");
  });

  it("rejects an invalid date", async () => {
    const { fileName } = await fixture(validFields("2026-02-30"));
    await expect(parsePost(fileName)).rejects.toThrow('frontmatter field "date" must be an ISO date or datetime.');
  });

  it.each([
    ["incomplete image dimensions", `imageWidth: 100`, "imageWidth and imageHeight must be supplied together."],
    ["an invalid image width", `image: "/blog/missing.jpg"\nimageAlt: "Fixture image"\nimageWidth: 0\nimageHeight: 100`, "imageWidth must be a positive integer."],
    ["an invalid image height", `image: "/blog/missing.jpg"\nimageAlt: "Fixture image"\nimageWidth: 100\nimageHeight: -1`, "imageHeight must be a positive integer."],
    ["dimensions without an image", `imageWidth: 100\nimageHeight: 100`, "image dimensions require an image field."],
    ["an invalid image path", `image: "/blog/../missing.jpg"\nimageAlt: "Fixture image"`, "image must be a path under public/blog/ (for example, /blog/example.jpg)."],
    ["a missing image alt", `image: "/blog/missing.jpg"`, "imageAlt is required when an image is set; decorative posts must omit image."],
    ["a missing image file", `image: "/blog/missing.jpg"\nimageAlt: "Fixture image"`, 'image path "/blog/missing.jpg" does not exist under public/.'],
  ])("rejects %s with its established message", async (_case, imageFields, message) => {
    const fields = `${validFields()}\n${imageFields}`;
    const { fileName } = await fixture(fields);
    await expect(parsePost(fileName)).rejects.toThrow(message);
  });

  it("does not publish drafts", async () => {
    const { fileName } = await fixture(validFields().replace("draft: false", "draft: true"));
    const result = await parsePost(fileName);
    expect(result.publishCandidate).toBe(false);
    expect(result.post).toBeUndefined();
  });

  it("does not mark future-dated posts as publish candidates", async () => {
    const { fileName } = await fixture(validFields("2999-01-01"));
    const result = await parsePost(fileName);
    expect(result.publishCandidate).toBe(false);
    expect(result.post?.date).toBe("2999-01-01");
  });
});
