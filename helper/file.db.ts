// helper/file-db.ts

import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(dataDir, fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  const data = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(data);
}

export function writeJsonFile<T>(fileName: string, data: T) {
  const filePath = path.join(dataDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
