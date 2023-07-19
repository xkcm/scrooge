import { BetterError, withCode, withMessage } from "@xkcm/better-errors";

@withCode("core.config.env_parser")
@withMessage("Error occured while parsing the env file")
export class EnvParserError extends BetterError {}
