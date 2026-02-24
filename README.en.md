# Web Grab CLI (TypeScript)

A Node.js + TypeScript command line tool that fetches a webpage URL and exports structured results into a local directory.

中文文档: [README.md](./README.md)

npm: https://www.npmjs.com/package/ts-afternoon

## Features

- Fetches webpage HTML (follows redirects)
- Extracts page title and heading outline (`h1`-`h6`)
- Collects links and resolves them to absolute URLs
- Exports three files:
  - `content.md`
  - `meta.json`
  - `links.json`

## Tech Stack

- TypeScript
- Commander (CLI argument parsing)
- Cheerio (HTML parsing)
- `fs/promises` (async file writing)

## Project Structure

```text
src/
  types.ts
  fetcher.ts
  parser.ts
  writer.ts
  index.ts
```

## Install and Build

```bash
npm install
npm run build
```

## Use As a Global Command (Recommended)

From the project root:

```bash
npm install
npm run build
npm link
```

Then run it from anywhere:

```bash
web-grab https://example.com -o ./output
```

Remove the global link:

```bash
npm unlink -g ts-afternoon
```

## Global Install (npm)

This package is published on npm:

```bash
npm install -g ts-afternoon
web-grab https://example.com -o ./output
```

## Usage

```bash
node dist/index.js <url> -o <outputDir>
```

Example:

```bash
node dist/index.js https://example.com -o output
```

Or via `npm start`:

```bash
npm start -- https://example.com -o output
```

## CLI Arguments

- `<url>`: required target webpage URL
- `-o, --output <dir>`: output directory, default is `output`

## Output Files

### `content.md`

Readable Markdown content extracted from headings, paragraphs, and list items.

### `meta.json`

Structure:

```json
{
  "title": "Page title",
  "url": "Final fetched URL",
  "headings": [
    { "level": 1, "text": "H1 text" },
    { "level": 2, "text": "H2 text" }
  ]
}
```

### `links.json`

Structure:

```json
[
  {
    "href": "https://example.com/path",
    "text": "Link text"
  }
]
```

## Sample Output

Command:

```bash
node dist/index.js https://example.com -o output
```

`meta.json` sample:

```json
{
  "title": "Example Domain",
  "url": "https://example.com/",
  "headings": [
    { "level": 1, "text": "Example Domain" }
  ]
}
```

`links.json` sample:

```json
[
  {
    "href": "https://iana.org/domains/example",
    "text": "Learn more"
  }
]
```

## Error Handling

The project uses `unknown` in `catch` blocks and narrows types before reading error messages, covering:

- Invalid URL input
- Network request failures
- HTML parsing failures
- Local file write failures
