import sessionRedisService from "#api:auth/services/session-redis/session-redis.service.js";
import tokenService from "#api:auth/services/token/token.service.js";
import type { ApiHandler } from "#root/api/api.types.js";
import { wrapMiddlewareWithSafeVariant } from "#root/api/utils/middleware.utils.js";

import { NoAuthCookieError } from "./token.middleware.errors.js";
import { verifySession } from "./token.utils.js";

const tokenMiddlewareRequestHandler: ApiHandler = async (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return next(new NoAuthCookieError());
  }

  let tokenPayload;
  try {
    tokenPayload = tokenService.decodeAuthToken(token);
  } catch (error) {
    return next(error);
  }

  try {
    await verifySession(tokenPayload);
  } catch (error) {
    return next(error);
  }

  await sessionRedisService.saveSessionInfo(
    tokenPayload.sessionId,
    "last_used",
    Date.now(),
  );

  res.locals.auth = {
    userId: tokenPayload.userId,
    token: {
      raw: token,
      payload: tokenPayload,
    },
    isAuthenticated: true,
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
