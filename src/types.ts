export interface HeadingItem {
  level: number;
  text: string;
}

export interface MetaInfo {
  title: string;
  url: string;
  headings: HeadingItem[];
}

export interface LinkItem {
  href: string;
  text: string;
}

export interface ParsedPage {
  contentMarkdown: string;
  meta: MetaInfo;
  links: LinkItem[];
}

export interface FetchResult {
  html: string;
  finalUrl: string;
}
