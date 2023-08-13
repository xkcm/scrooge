import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { assertPath } from "#core/utils/utils.js";

const dirname = fileURLToPath(import.meta.url);
export async function loadQuery(fileName: string) {
  const filePath = path.join(dirname, "../../../assets/queries", fileName);
  await assertPath(filePath);

  const query = await readFile(filePath, { encoding: "utf-8" });
  return query;
}
