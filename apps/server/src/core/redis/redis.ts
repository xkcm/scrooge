import { createClient } from "redis";
import { env } from "#core/config/env.config.js";

const redisClient: ReturnType<typeof createClient> = createClient({
  url: env.REDIS_URL,
});

export default redisClient;
