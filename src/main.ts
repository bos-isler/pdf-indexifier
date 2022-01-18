import fs from "fs";
import path from "path";
import { traverse } from "./traverser";

const filePath = path.resolve(__dirname, "../sample.pdf");
const dataBuffer = fs.readFileSync(filePath, { flag: "r" });

traverse(dataBuffer);
