import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { ParsedPage } from "./types";

export async function writeArtifacts(outputDir: string, parsed: ParsedPage): Promise<void> {
  const outputPath = resolve(outputDir);
  const contentPath = resolve(outputPath, "content.md");
  const metaPath = resolve(outputPath, "meta.json");
  const linksPath = resolve(outputPath, "links.json");

  try {
    await mkdir(outputPath, { recursive: true });
    await Promise.all([
      writeFile(contentPath, parsed.contentMarkdown, "utf8"),
      writeFile(metaPath, JSON.stringify(parsed.meta, null, 2) + "\n", "utf8"),
      writeFile(linksPath, JSON.stringify(parsed.links, null, 2) + "\n", "utf8"),
    ]);
  } catch (error: unknown) {
    throw new Error(`Failed to write output files: ${getErrorMessage(error)}`);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
