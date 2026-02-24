import * as cheerio from "cheerio";

import type { ParsedPage } from "./types";
import type { HeadingItem, LinkItem } from "./types";

export function parseHtml(html: string, pageUrl: string): ParsedPage {
  try {
    const $ = cheerio.load(html);
    const title = $("title").first().text().trim() || "Untitled";
    const headings = extractHeadings($);
    const links = extractLinks($, pageUrl);
    const contentMarkdown = buildMarkdown(title, $);

    return {
      contentMarkdown,
      meta: {
        title,
        url: pageUrl,
        headings,
      },
      links,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to parse HTML: ${getErrorMessage(error)}`);
  }
}

function extractHeadings($: cheerio.CheerioAPI): HeadingItem[] {
  const headings: HeadingItem[] = [];

  $("h1, h2, h3, h4, h5, h6").each((_, element) => {
    const tagName = element.tagName.toLowerCase();
    const level = Number(tagName.slice(1));
    const text = $(element).text().trim();

    if (!Number.isNaN(level) && text.length > 0) {
      headings.push({ level, text });
    }
  });

  return headings;
}

function extractLinks($: cheerio.CheerioAPI, pageUrl: string): LinkItem[] {
  const linkMap = new Map<string, LinkItem>();

  $("a[href]").each((_, element) => {
    const hrefRaw = $(element).attr("href");
    if (!hrefRaw) {
      return;
    }

    const href = toAbsoluteUrl(hrefRaw, pageUrl);
    if (!href) {
      return;
    }

    const text = $(element).text().trim() || href;
    if (!linkMap.has(href)) {
      linkMap.set(href, { href, text });
    }
  });

  return Array.from(linkMap.values());
}

function buildMarkdown(title: string, $: cheerio.CheerioAPI): string {
  const root = $("main, article").first();
  const scope = root.length > 0 ? root : $("body");
  const blocks: string[] = [];

  scope.find("h1, h2, h3, h4, h5, h6, p, li").each((_, element) => {
    const text = $(element).text().replace(/\s+/g, " ").trim();
    if (text.length > 0) {
      blocks.push(text);
    }
  });

  const lines: string[] = [`# ${title}`, ""];
  if (blocks.length === 0) {
    lines.push("_No readable content extracted._");
  } else {
    for (const block of blocks) {
      lines.push(block, "");
    }
  }

  return lines.join("\n").trimEnd() + "\n";
}

function toAbsoluteUrl(href: string, pageUrl: string): string | null {
  try {
    return new URL(href, pageUrl).toString();
  } catch {
    return null;
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
