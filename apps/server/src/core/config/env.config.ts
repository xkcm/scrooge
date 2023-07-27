import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { assertPath, getEnvVariableOrThrow } from "../utils/utils.js";
import { EnvParserError } from "./config.errors.js";
import { EnvConfigSchema, EnvMode, EnvModeSchema } from "./config.schemas.js";

const envMode = EnvModeSchema.parse(getEnvVariableOrThrow<EnvMode>("NODE_ENV"));
const fileName = `.env.${envMode}`;

const envFilePath = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../../",
  fileName,
);
await assertPath(envFilePath);

const { error, parsed } = dotenv.config({ path: envFilePath });
if (error) {
  throw new EnvParserError();
}

const config = EnvConfigSchema.parse(parsed);

export { config as env, envMode };
