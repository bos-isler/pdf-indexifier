#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program, Option } from "commander";
import { indexify } from "./indexify";
import { summarize } from "./summarize";
import { output } from "./output";

// prettier-ignore
program.name("pdf-indexify")
  .version("0.0.1", "-v, --version")
  .argument("<pdf-path>", "Path to the PDF file")
  .argument("<keywords-path>", "Path to the keywords to be indexed")
  .option("-po, --page-offset <offset>", "After which pages does the pagination begin", parseInt, 0)
  .option("-sb, --scan-begin <line>", "Which page to begin indexing (inclusive)", parseInt, 1)
  .option("-se, --scan-end <line>", "Which page to finish indexing (inclusive)", parseInt, Number.MAX_SAFE_INTEGER)
  .option("-l, --locale <locale>", "Locale of the keywords and pdf", "en-US")
  .option("-o, --output-path <path>", "Locale of the keywords and pdf", path.resolve(process.cwd(), "./output.csv"))
  .action(indexifyPdf);

async function indexifyPdf(pdfPath: string, keywordsPath: string) {
  const options = program.opts();

  if (isNaN(options.pageOffset)) {
    throw new Error("Page offset MUST be a number");
  }
  if (isNaN(options.scanBegin)) {
    throw new Error("Scan begin MUST be a number");
  }
  if (isNaN(options.scanEnd)) {
    throw new Error("Scan end MUST be a number");
  }

  // Read PDF
  const pdfFilePath = path.resolve(process.cwd(), pdfPath);
  const pdfBuffer = fs.readFileSync(pdfFilePath, { flag: "r" });

  // Read keywords
  const keywordsFilePath = path.resolve(process.cwd(), keywordsPath);
  const keywordTable: [string, RegExp][] = fs
    .readFileSync(keywordsFilePath, {
      flag: "r",
      encoding: "utf-8",
    })
    .split(/\r?\n/)
    .map((keyword) => [keyword, new RegExp(keyword, "gim")]);

  const summary = await summarize({
    buffer: pdfBuffer,
    pageOffset: options.pageOffset,
    scanBegin: options.scanBegin,
    scanEnd: options.scanEnd,
  });

  const index = await indexify({
    summary,
    keywordTable,
  });

  return output({
    index,
    path: options.outputPath,
    locale: options.locale,
  });
}

program.parse();
