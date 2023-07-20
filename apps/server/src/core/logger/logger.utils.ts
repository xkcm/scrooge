import util from "node:util";

import chalk from "chalk";
import winston from "winston";

export enum LoggerLevels {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

// eslint-disable-next-line no-spaced-func
export const COLOR_FORMATTERS = new Map<string, (message: string) => string>([
  [LoggerLevels.ERROR, chalk.red.bold],
  [LoggerLevels.WARN, chalk.yellow],
  [LoggerLevels.INFO, chalk.blue],
  [LoggerLevels.HTTP, chalk.gray],
  [LoggerLevels.VERBOSE, chalk.green],
  [LoggerLevels.DEBUG, chalk.rgb(163, 134, 47)],
  [LoggerLevels.SILLY, chalk.magenta],
]);
export const DEFAULT_COLOR_FORMATTER = chalk.bold;

export const stringifyScroogeError = (error: Error) => {
  const message = util.formatWithOptions({ depth: null }, error);
  // if (error.cause) {
  //   message += "\n";
  //   const stringifiedCause = stringifyScroogeError(error.cause as Error);
  //   message += (`${chalk.bold("[cause]")} ${stringifiedCause}`).replace(/^/gm, "  ");
  // }
  return message;
};

export const CONSOLE_DEBUG_FORMAT = winston.format.printf((info) => {
  let { message } = info;
  if (info.error) {
    message += "\n";
    message += chalk.red(stringifyScroogeError(info.error));
  }

  const colorFormatter = COLOR_FORMATTERS.get(info.level) || DEFAULT_COLOR_FORMATTER;
  const colorizedLevelLabel = colorFormatter(info.level.padEnd(8, " "));
  const timestamp = chalk.gray(`[${info.timestamp}]`);

  return `${colorizedLevelLabel}${timestamp} ${message}`;
});
