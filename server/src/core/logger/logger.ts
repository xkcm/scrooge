import winston from "winston";

import { CONSOLE_DEBUG_FORMAT } from "./logger.utils.js";

const COMMON_FORMAT = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
);

const CONSOLE_FORMAT = winston.format.combine(
  COMMON_FORMAT,
  CONSOLE_DEBUG_FORMAT,
);

const logger = winston.createLogger();

logger.level = "silly";
logger.add(new winston.transports.Console({
  format: CONSOLE_FORMAT,
}));

// TODO: Add file transport for prod mode
export default logger;
