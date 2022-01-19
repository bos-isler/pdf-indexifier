interface Options {
  summary: Map<number, string>;
  keywordTable: [string, RegExp][];
}

export async function indexify(options: Options) {
  const index = new Map<string, Set<number>>();

  for (const [keyword, regex] of options.keywordTable) {
    for (const [pageNumber, pageSummary] of options.summary) {
      if (regex.test(pageSummary)) {
        const entry = index.has(keyword)
          ? index.get(keyword)
          : index.set(keyword, new Set()) && index.get(keyword);

        entry.add(pageNumber);
      }
    }
  }

  return index;
}
