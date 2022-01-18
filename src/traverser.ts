import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { PDF } from "./env";

const PAGE_OFFSET = 1;
const SCAN_BEGIN = 10;
const SCAN_END = 75;
const KEYWORDS: [string, RegExp][] = fs
  .readFileSync(path.resolve(__dirname, "../keywords.csv"))
  .toString("utf-8")
  .split(/\r?\n/)
  .map((keyword) => [keyword, new RegExp(keyword, "gim")]);

const INDEX = new Map<string, Set<number>>();

async function pageRenderCallback(page: PDF.Page) {
  const pageNumber = page.pageIndex + 1 - PAGE_OFFSET;

  // Do not check intro & outro stuff
  if (pageNumber < SCAN_BEGIN) return;
  if (pageNumber > SCAN_END) return;
  console.log(pageNumber);

  const textContent = await page.getTextContent({});

  for (const [keyword, regex] of KEYWORDS) {
    for (const item of textContent.items) {
      if (regex.test(item.str)) {
        const entry = INDEX.has(keyword)
          ? INDEX.get(keyword)
          : INDEX.set(keyword, new Set()) && INDEX.get(keyword);

        entry.add(pageNumber);
      }
    }
  }
}

export async function traverse(buffer: Buffer) {
  // @ts-ignore
  await pdf(buffer, { pagerender: pageRenderCallback });

  const keywords = [...INDEX.keys()].sort((a, b) =>
    a.localeCompare(b, "tr-TR")
  );

  for (const keyword of keywords) {
    const pageNumbers = INDEX.get(keyword);
    console.log(`${keyword}:`);
    console.log([...pageNumbers.values()].join(", "));
    console.log();
  }
}
