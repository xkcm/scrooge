import { wrapExpressErrorHandler } from "#api/errors/errors.utils.js";
import { setCookie } from "#api/utils/cookies.util.js";
import { AuthFlowResult, runAuthFlow } from "#api:auth/flows/auth.flow.js";
import tokenService from "#api:auth/services/token/token.service.js";
import { AuthTokenPayload } from "#api:auth/services/token/token.service.types.js";
import type { ApiHandler } from "#root/api/api.types.js";
import { wrapMiddlewareWithSafeVariant } from "#root/api/utils/middleware.utils.js";

import {
  RelogRequiredError,
  UnrecognizedAuthFlowStateError,
} from "./token.middleware.errors.js";

const tokenMiddlewareRequestHandler: ApiHandler = wrapExpressErrorHandler(
  async (req, res, next) => {
    const { refreshToken, authToken } = req.cookies ?? {};

    let resolvedAuthToken = authToken;
    const authFlowResult = await runAuthFlow(authToken, refreshToken);

    switch (authFlowResult.state) {
      case "relog_required":
        // clear cookies
        setCookie(res, "authToken", "", 0);
        setCookie(res, "refreshToken", "", 0);
        // set relog cookie
        setCookie(
          res,
          "relogToken",
          authFlowResult.relogToken.token,
          authFlowResult.relogToken.expiresIn,
        );
        throw new RelogRequiredError();

      case "refreshed":
        setCookie(
          res,
          "authToken",
          authFlowResult.newAuthToken.token,
          authFlowResult.newAuthToken.expiresIn,
        );
        resolvedAuthToken = authFlowResult.newAuthToken.token;
        break;

      case "authorized":
        break;

      default:
        throw new UnrecognizedAuthFlowStateError({
          metadata: { state: (authFlowResult as AuthFlowResult).state },
        });
    }

    const tokenPayload =
      tokenService.decodeTokenPayload<AuthTokenPayload>(resolvedAuthToken);
    res.locals.auth = {
      isAuthenticated: true,
      userId: tokenPayload.userId,
      token: {
        raw: authToken,
        payload: tokenPayload,
      },
    };

    return next();
  },
);

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
