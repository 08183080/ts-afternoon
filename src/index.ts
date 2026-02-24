#!/usr/bin/env node

import { Command } from "commander";

import { fetchHtml } from "./fetcher";
import { parseHtml } from "./parser";
import { writeArtifacts } from "./writer";

interface CliOptions {
  output: string;
}

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name("web-grab")
    .description("输入 URL，抓取网页并导出结构化结果到本地目录")
    .argument("<url>", "网页 URL")
    .option("-o, --output <dir>", "输出目录", "output")
    .action(async (url: string, options: CliOptions) => {
      await execute(url, options.output);
    });

  try {
    await program.parseAsync(argv);
  } catch (error: unknown) {
    throw new Error(`CLI failed: ${getErrorMessage(error)}`);
  }
}

async function execute(url: string, outputDir: string): Promise<void> {
  try {
    const { html, finalUrl } = await fetchHtml(url);
    const parsed = parseHtml(html, finalUrl);
    await writeArtifacts(outputDir, parsed);
    console.log(`Export completed: ${outputDir}`);
  } catch (error: unknown) {
    throw new Error(`Execution failed: ${getErrorMessage(error)}`);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

if (require.main === module) {
  runCli(process.argv).catch((error: unknown) => {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
  });
}
