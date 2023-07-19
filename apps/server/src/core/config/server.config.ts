import { readFile } from "fs/promises";
import path from "path";
import yamljs from "yamljs";

import { assertPath, getEnvVariableOrThrow } from "../utils/index.js";
import { ServerConfigSchema } from "./config.schemas.js";

const serverConfigPath = path.resolve(
  getEnvVariableOrThrow("SCROOGE_CWD"),
  "config.yml",
);
await assertPath(serverConfigPath);

const fileContents = await readFile(serverConfigPath, { encoding: "utf-8" });
const parsedYaml = yamljs.parse(fileContents);
const serverConfig = ServerConfigSchema.parse(parsedYaml);

export default serverConfig;
