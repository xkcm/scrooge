import {
  NoAuthTokenError,
  SessionIdMismatchError,
  UserIdMismatchError,
} from "#api:auth/middleware/token/token.middleware.errors.js";
import sessionService from "#api:auth/services/session/session.service.js";
import sessionRedisService from "#api:auth/services/session-redis/session-redis.service.js";
import tokenService from "#api:auth/services/token/token.service.js";
import {
  AuthTokenPayload,
  RefreshTokenPayload,
} from "#api:auth/services/token/token.service.types.js";

export async function verifySession({ sessionId, userId }: AuthTokenPayload) {
  const sessionLastUsed = await sessionRedisService.getSessionInfo(
    sessionId,
    "last_used",
  );

  return !!sessionLastUsed || sessionService.verifySession(userId, sessionId);
}

export function assertTokenPayloadsValidity(
  authTokenPayload: AuthTokenPayload,
  refreshTokenPayload: RefreshTokenPayload,
) {
  if (authTokenPayload.userId !== refreshTokenPayload.userId) {
    throw new UserIdMismatchError();
  }

  if (authTokenPayload.sessionId !== refreshTokenPayload.sessionId) {
    throw new SessionIdMismatchError();
  }
}

export function validateAndDecodeAuthToken(authToken?: string) {
  if (!authToken) {
    throw new NoAuthTokenError();
  }

  return tokenService.verifyAuthToken(authToken);
}
