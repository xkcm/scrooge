import sessionService from "#api:auth/services/session/session.service.js";
import sessionRedisService from "#api:auth/services/session-redis/session-redis.service.js";
import { TokenExpiredError } from "#api:auth/services/token/token.service.errors.js";
import tokenService from "#api:auth/services/token/token.service.js";
import {
  AuthTokenPayload,
  RefreshTokenPayload,
} from "#api:auth/services/token/token.service.types.js";

import {
  NoAuthCookieError,
  NoRefreshCookieError,
  RefreshTokenExpiredError,
} from "./token.middleware.errors.js";

export async function verifyAuthToken(authToken: string) {
  if (!authToken) {
    throw new NoAuthCookieError();
  }

  const tokenPayload = tokenService.decodeAuthToken(authToken);
  await verifySession({
    sessionId: tokenPayload.sessionId,
    userId: tokenPayload.userId,
  });
}

export async function refreshAuthToken(refreshToken: string) {
  if (!refreshToken) {
    throw new NoRefreshCookieError();
  }

  const refreshTokenPayload = tokenService.decodeRefreshToken(refreshToken);
  const tokenResult = tokenService.createAuthToken({
    sessionId: refreshTokenPayload.sessionId,
    userId: refreshTokenPayload.userId,
  });

  return tokenResult;
}

export async function resolveAuthToken(
  authToken: string,
  refreshToken: string,
): Promise<
  readonly [{ token: string; expiresIn?: number } | null, unknown | null]
> {
  let error: unknown = null;
  try {
    await verifyAuthToken(authToken);
    return [{ token: authToken }, null];
  } catch (e) {
    error = e;
  }

  // only refresh if token is expired, or if it's not present
  const isErrorAllowed = [TokenExpiredError, NoAuthCookieError].some(
    (errorType) => error instanceof errorType,
  );

  if (!isErrorAllowed) {
    return [null, error];
  }

  try {
    const tokenResult = await refreshAuthToken(refreshToken);
    return [tokenResult, null];
  } catch (e) {
    error = e;
  }

  if (error instanceof NoRefreshCookieError) {
    return [null, new NoAuthCookieError()];
  }
  if (!(error instanceof TokenExpiredError)) {
    return [null, error];
  }

  const { userId, sessionId } =
    tokenService.extractTokenPayload<RefreshTokenPayload>(refreshToken);

  return [
    null,
    new RefreshTokenExpiredError({
      metadata: {
        sessionId,
        userId,
      },
    }),
  ];
}

export async function verifySession({ sessionId, userId }: AuthTokenPayload) {
  const sessionLastUsed = await sessionRedisService.getSessionInfo(
    sessionId,
    "last_used",
  );

  if (sessionLastUsed) {
    return true;
  }

  return sessionService.verifySessionById(userId, sessionId);
}
