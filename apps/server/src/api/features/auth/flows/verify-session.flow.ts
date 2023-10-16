import { verifySession } from "#api:auth/helpers/auth.helpers.js";
import { InvalidSessionError } from "#api:auth/services/session/session.service.errors.js";
import sessionService from "#api:auth/services/session/session.service.js";
import sessionRedisService from "#api:auth/services/session-redis/session-redis.service.js";

export async function runVerifySessionFlow(userId: string, sessionId: string) {
  try {
    await verifySession({ userId, sessionId });
    await sessionRedisService.saveSessionInfo(
      sessionId,
      "last_used",
      Date.now(),
    );
  } catch (sessionVerificationError) {
    if (sessionVerificationError instanceof InvalidSessionError) {
      await sessionService.tryInvalidateSession(userId, sessionId);
    }

    throw sessionVerificationError;
  }
}
