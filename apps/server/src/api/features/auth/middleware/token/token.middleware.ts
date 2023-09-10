import { InferMetadata } from "@xkcm/better-errors";

import { setCookie } from "#api/utils/cookies.util.js";
import sessionRedisService from "#api:auth/services/session-redis/session-redis.service.js";
import tokenService from "#api:auth/services/token/token.service.js";
import type { ApiHandler } from "#root/api/api.types.js";
import { wrapMiddlewareWithSafeVariant } from "#root/api/utils/middleware.utils.js";

import { RefreshTokenExpiredError } from "./token.middleware.errors.js";
import { resolveAuthToken } from "./token.middleware.helpers.js";

const tokenMiddlewareRequestHandler: ApiHandler = async (req, res, next) => {
  const { refreshToken, authToken } = req.cookies ?? {};

  const [resolvedAuthToken, error] = await resolveAuthToken(
    authToken,
    refreshToken,
  );

  if (error instanceof RefreshTokenExpiredError) {
    const { sessionId, userId } = error.metadata as Required<
      InferMetadata<RefreshTokenExpiredError>
    >;
    const relogToken = tokenService.createRelogToken({
      sessionId,
      userId,
    });
    setCookie(res, "relogToken", relogToken.token, relogToken.expiresIn);
    setCookie(res, "refreshToken", "", 0); // clearing cookie

    return next(error);
  }
  if (error) {
    return next(error);
  }

  if (resolvedAuthToken?.token !== authToken) {
    setCookie(
      res,
      "authToken",
      resolvedAuthToken?.token as string,
      resolvedAuthToken?.expiresIn as number,
    );
  }

  const tokenPayload = tokenService.decodeAuthToken(
    resolvedAuthToken?.token as string,
  );

  await sessionRedisService.saveSessionInfo(
    tokenPayload.sessionId,
    "last_used",
    Date.now(),
  );

  res.locals.auth = {
    isAuthenticated: true,
    userId: tokenPayload.userId,
    token: {
      raw: authToken,
      payload: tokenPayload,
    },
  };

  return next();
};

const tokenMiddleware = wrapMiddlewareWithSafeVariant({
  strictHandler: tokenMiddlewareRequestHandler,
  errorCallback(req, res, next, error) {
    res.locals.auth = {
      isAuthenticated: false,
      error,
    };
  },
});

export default tokenMiddleware;
