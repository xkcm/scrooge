import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { promisify } from "util";

import { env } from "#core/config/env.config.js";
import logger from "#core/logger/logger.js";
import morganMiddleware from "#core/middleware/morgan.middleware.js";
import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
import redisClient from "#core/redis/redis.js";
import { createErrorRethrower } from "#core/utils/utils.js";
import { apiRouter } from "#root/api/api.js";

import {
  DatabaseUnavailableError,
  HttpServerNotRunningError,
  RedisUnavailableError,
} from "./server.errors.js";

let httpServer:
  | ReturnType<(typeof express)["application"]["listen"]>
  | undefined;
const expressApp = express();

export async function bootstrap() {
  expressApp.set("x-powered-by", false);
  expressApp.set("trust proxy", true);

  expressApp.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  expressApp.use(cookieParser());
  expressApp.use(morganMiddleware);

  expressApp.use("/api", apiRouter);

  logger.info("App bootstrapped");
}

export async function assertDatabaseConnection() {
  await prismaClient.$connect().catch(
    createPrismaErrorParser({
      P1001: DatabaseUnavailableError,
    }),
  );
  logger.info("PostgreSQL connection estabilished");

  await redisClient
    .connect()
    .catch(createErrorRethrower(RedisUnavailableError));
  logger.info("Redis connection estabilished");
}

export function start() {
  httpServer = expressApp.listen(env.PORT, () => {
    logger.info(`Server listening on http://127.0.0.1:${env.PORT}/`);
  });

  return httpServer;
}

export async function stop() {
  if (!httpServer) {
    throw new HttpServerNotRunningError();
  }

  logger.warn("Stopping server");

  await promisify(httpServer.close.bind(httpServer))();
  await prismaClient.$disconnect();
  await redisClient.disconnect();

  logger.info("Server stopped");
}

export function isListening() {
  return httpServer !== undefined && httpServer.listening;
}
