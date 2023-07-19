import sessionRedisService from "#api:auth/services/session-redis/session-redis.service.js";
import sessionService from "#api:auth/services/session/session.service.js";
import { AuthTokenPayload } from "#api:auth/services/token/token.service.types.js";

export async function verifySession(
  {
    sessionId,
    userId,
  }: AuthTokenPayload,
) {
  const sessionLastUsed = await sessionRedisService.getSessionInfo(sessionId, "last_used");

  if (sessionLastUsed) {
    return true;
  }

  return sessionService.verifySessionById(userId, sessionId);
}
