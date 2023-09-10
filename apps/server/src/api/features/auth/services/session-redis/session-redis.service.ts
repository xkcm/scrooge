import redisClient from "#core/redis/redis.js";

import { SessionRedisService } from "./session-redis.service.types.js";

const sessionRedisService: SessionRedisService = {
  async saveSessionInfo(sessionId, property, value) {
    return redisClient.hSet(`session-info:${sessionId}`, property, value);
  },

  async getSessionInfo(sessionId, property) {
    return redisClient.hGet(`session-info:${sessionId}`, property);
  },

  async getAllSessionInfo(sessionId) {
    const lastUsed = (await this.getSessionInfo(sessionId, "last_used")) || 0;
    return {
      lastUsed: new Date(+lastUsed),
    };
  },

  async removeAllSessionInfo(sessionId) {
    const key = `session-info:${sessionId}`;

    return redisClient.del(key);
  },
};

export default sessionRedisService;
