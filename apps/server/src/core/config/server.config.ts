import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import yamljs from "yamljs";

import { assertPath } from "../utils/utils.js";
import { ServerConfigSchema } from "./config.schemas.js";

const serverConfigPath = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../..",
  "config.yml",
);
await assertPath(serverConfigPath);

const fileContents = await readFile(serverConfigPath, { encoding: "utf-8" });
const parsedYaml = yamljs.parse(fileContents);
const serverConfig = ServerConfigSchema.parse(parsedYaml);

export default serverConfig;
