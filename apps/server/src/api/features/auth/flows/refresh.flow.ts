import { NoRefreshTokenError } from "#api:auth/middleware/token/token.middleware.errors.js";
import { TokenExpiredError } from "#api:auth/services/token/token.service.errors.js";
import tokenService from "#api:auth/services/token/token.service.js";
import {
  CreateTokenResult,
  RefreshTokenPayload,
} from "#api:auth/services/token/token.service.types.js";

export type RefreshFlowResult =
  | {
      sessionId: string;
      userId: string;

      state: "relog_required";
    }
  | {
      sessionId: string;
      userId: string;

      state: "refreshed";
      newAuthToken: CreateTokenResult;
    };

export async function runRefreshFlow(
  refreshToken?: string,
): Promise<RefreshFlowResult> {
  if (!refreshToken) {
    throw new NoRefreshTokenError();
  }

  const { userId, sessionId } =
    tokenService.decodeTokenPayload<RefreshTokenPayload>(refreshToken);

  try {
    tokenService.verifyRefreshToken(refreshToken);
  } catch (refreshDecodingError) {
    if (!(refreshDecodingError instanceof TokenExpiredError)) {
      throw refreshDecodingError;
    }

    return {
      state: "relog_required",
      userId,
      sessionId,
    };
  }

  const newAuthToken = tokenService.createAuthToken({
    sessionId,
    userId,
  });

  return {
    userId,
    sessionId,
    newAuthToken,
    state: "refreshed",
  };
}
