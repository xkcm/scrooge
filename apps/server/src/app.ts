import { setDefaultMergingBehavior } from "@xkcm/better-errors";
import * as server from "#core/server/server.js";
import logger from "#core/logger/logger.js";

setDefaultMergingBehavior("compromise:submissive");

async function start() {
  await server.bootstrap();
  await server.assertDatabaseConnection().catch(logger.error);
  server.start();
}

start().catch(console.error);
