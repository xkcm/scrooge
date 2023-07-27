import morgan from "morgan";

import logger from "#core/logger/logger.js";

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  },
);

export default morganMiddleware;
