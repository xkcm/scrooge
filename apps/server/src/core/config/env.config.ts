import dotenv from "dotenv";
import path from "path";

import { assertPath, getEnvVariableOrThrow } from "../utils/index.js";

import { EnvParserError } from "./config.errors.js";
import { EnvConfigSchema, EnvMode, EnvModeSchema } from "./config.schemas.js";

const ENV_FILE_PATHS: Record<EnvMode, string> = {
  production: ".env",
  development: ".env.dev",
  testing: ".env.dev", // todo: add testing environment file
};

const envMode = EnvModeSchema.parse(getEnvVariableOrThrow<EnvMode>("NODE_ENV"));
const appPath = getEnvVariableOrThrow("SCROOGE_CWD");

const envFilePath = path.resolve(appPath, ENV_FILE_PATHS[envMode]);
await assertPath(envFilePath);

const { error, parsed } = dotenv.config({ path: envFilePath });
if (error) {
  throw new EnvParserError();
}

const config = EnvConfigSchema.parse(parsed);

export {
  config as env,
  envMode,
  appPath,
};
