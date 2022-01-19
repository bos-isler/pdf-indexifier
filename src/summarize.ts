import pdf from "pdf-parse";
import { PDF } from "./declarations";

interface Options {
  buffer: Buffer;
  pageOffset: number;
  scanBegin: number;
  scanEnd: number;
}

export async function summarize(options: Options) {
  const summary = new Map<number, string>();
  await pdf(options.buffer, {
    // @ts-ignore
    pagerender: async function pageRenderCallback(page: PDF.Page) {
      const pageNumber = page.pageIndex + 1 - options.pageOffset;

      // Do not check intro & outro stuff
      if (pageNumber < options.scanBegin) return;
      if (pageNumber > options.scanEnd) return;

      const textContent = await page.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: true,
      });

      const pageSummary = textContent.items.map((i) => i.str.trim()).join("");
      summary.set(pageNumber, pageSummary);
    },
  });
  return summary;
}
