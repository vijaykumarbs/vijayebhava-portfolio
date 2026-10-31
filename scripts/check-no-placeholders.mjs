import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const outputDirectory = resolve(process.cwd(), "out");
const sourceDirectories = [resolve(process.cwd(), "src"), resolve(process.cwd(), "content")];
const scannedExtensions = new Set([".html", ".txt", ".xml"]);
const matches = [];
const sourceMatches = [];

async function scanSource(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scanSource(path);
    } else if ((await readFile(path, "utf8")).includes("TODO(")) {
      sourceMatches.push(path);
    }
  }
}

async function scan(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Cannot read built output directory "${directory}". Run npm run build first.`, { cause: error });
  }

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(path);
    } else if (scannedExtensions.has(path.slice(path.lastIndexOf(".")))) {
      const contents = await readFile(path, "utf8");
      if (contents.includes("TODO(")) matches.push(path);
    }
  }
}

try {
  for (const directory of sourceDirectories) await scanSource(directory);
  if (sourceMatches.length) {
    console.warn(`Warning: found "TODO(" in source/content (non-failing):\n${sourceMatches.map((path) => `- ${path}`).join("\n")}`);
  }

  await scan(outputDirectory);
  if (matches.length) {
    console.error(`Found "TODO(" in built output:\n${matches.map((path) => `- ${path}`).join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log('No "TODO(" placeholders found in built HTML, text, or XML files.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
