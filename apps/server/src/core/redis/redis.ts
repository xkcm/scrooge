import { createClient } from "redis";
import { env } from "#core/config/env.config.js";

const redisClient = createClient({
  url: env.REDIS_URL,
});

export default redisClient;
