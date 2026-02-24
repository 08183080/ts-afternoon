# Web Grab CLI (TypeScript)

一个基于 Node.js + TypeScript 的命令行工具：输入网页 URL，抓取页面并导出结构化结果到本地目录。

English version: [README.en.md](./README.en.md)

## 功能

- 抓取网页 HTML（自动跟随重定向）
- 解析标题和标题层级（`h1`-`h6`）
- 提取页面链接列表（转换为绝对 URL）
- 导出三份文件：
  - `content.md`
  - `meta.json`
  - `links.json`

## 技术栈

- TypeScript
- Commander（CLI 参数解析）
- Cheerio（HTML 解析）
- `fs/promises`（异步文件写入）

## 项目结构

```text
src/
  types.ts
  fetcher.ts
  parser.ts
  writer.ts
  index.ts
```

## 安装与构建

```bash
npm install
npm run build
```

## 使用方式

```bash
node dist/index.js <url> -o <outputDir>
```

示例：

```bash
node dist/index.js https://example.com -o output
```

也可以用 `npm start`：

```bash
npm start -- https://example.com -o output
```

## CLI 参数

- `<url>`：必填，目标网页地址
- `-o, --output <dir>`：输出目录，默认值为 `output`

## 输出文件说明

### `content.md`

提取页面正文相关文本（标题、段落、列表项），写入 Markdown。

### `meta.json`

结构如下：

```json
{
  "title": "页面标题",
  "url": "最终抓取 URL",
  "headings": [
    { "level": 1, "text": "H1 文本" },
    { "level": 2, "text": "H2 文本" }
  ]
}
```

### `links.json`

结构如下：

```json
[
  {
    "href": "https://example.com/path",
    "text": "链接文本"
  }
]
```

## 示例输出

命令：

```bash
node dist/index.js https://example.com -o output
```

`meta.json` 示例：

```json
{
  "title": "Example Domain",
  "url": "https://example.com/",
  "headings": [
    { "level": 1, "text": "Example Domain" }
  ]
}
```

`links.json` 示例：

```json
[
  {
    "href": "https://iana.org/domains/example",
    "text": "Learn more"
  }
]
```

## 错误处理

项目统一使用 `unknown` 捕获错误，并通过类型收窄提取错误信息，覆盖：

- URL 非法
- 网络请求失败
- HTML 解析失败
- 本地文件写入失败

## 开发脚本

```bash
npm run build
npm start -- <url> -o <outputDir>
```
