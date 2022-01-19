import fs from "fs";
import path from "path";

interface Options {
  index: Map<string, Set<number>>;
  path: string;
  locale: string;
}

export async function output(options: Options) {
  const parentDir = path.dirname(options.path);
  await fs.promises.mkdir(parentDir, { recursive: true });

  let outputData = "";

  const keywords = [...options.index.keys()].sort((a, b) =>
    a.localeCompare(b, options.locale)
  );

  for (const keyword of keywords) {
    const pageNumbers = options.index.get(keyword);
    outputData += `${keyword}, `;
    outputData += [...pageNumbers.values()].join(" ");
    outputData += "\n";
  }

  return fs.promises.writeFile(options.path, outputData, { encoding: "utf-8" });
}
