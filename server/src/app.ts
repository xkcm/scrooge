import { setDefaultMergingBehavior } from "@xkcm/better-errors";
import * as server from "#core/server/server.js";

setDefaultMergingBehavior("compromise:submissive");

async function start() {
  await server.bootstrap();
  await server.assertDatabaseConnection();
  server.start();
}

start().catch(console.error);
