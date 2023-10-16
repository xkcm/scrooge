import { EmptyAuthError } from "#api:auth/auth.errors.js";
import {
  assertTokenPayloadsValidity,
  validateAndDecodeAuthToken,
} from "#api:auth/helpers/auth.helpers.js";
import {
  NoAuthTokenError,
  NoRefreshTokenError,
} from "#api:auth/middleware/token/token.middleware.errors.js";
import { TokenExpiredError } from "#api:auth/services/token/token.service.errors.js";
import tokenService from "#api:auth/services/token/token.service.js";
import {
  AuthTokenPayload,
  CreateTokenResult,
  RefreshTokenPayload,
} from "#api:auth/services/token/token.service.types.js";
import { createErrorMapper } from "#core/utils/utils.js";

import { runRefreshFlow } from "./refresh.flow.js";
import { runVerifySessionFlow } from "./verify-session.flow.js";

export type AuthFlowResult =
  | {
      state: "relog_required";
      relogToken: CreateTokenResult;
    }
  | {
      state: "refreshed";
      newAuthToken: CreateTokenResult;
    }
  | {
      state: "authorized";
    };

export async function runAuthFlow(
  authToken?: string,
  refreshToken?: string,
): Promise<AuthFlowResult> {
  if (authToken && refreshToken) {
    assertTokenPayloadsValidity(
      tokenService.decodeTokenPayload<AuthTokenPayload>(authToken),
      tokenService.decodeTokenPayload<RefreshTokenPayload>(refreshToken),
    );
  }

  let userId: string;
  let sessionId: string;

  let newAuthToken: CreateTokenResult | null = null;
  let relogRequired: boolean = false;

  try {
    ({ userId, sessionId } = validateAndDecodeAuthToken(authToken));
  } catch (authDecodingError) {
    if (
      !(
        authDecodingError instanceof TokenExpiredError ||
        authDecodingError instanceof NoAuthTokenError
      )
    ) {
      throw authDecodingError;
    }

    const refreshFlowResult = await runRefreshFlow(refreshToken).catch(
      createErrorMapper(new Map([[NoRefreshTokenError, EmptyAuthError]])),
    );
    ({ userId, sessionId } = refreshFlowResult);
    relogRequired = refreshFlowResult.state === "relog_required";

    if (refreshFlowResult.state === "refreshed") {
      newAuthToken = refreshFlowResult.newAuthToken;
    }
  }

  await runVerifySessionFlow(userId, sessionId);

  if (relogRequired) {
    return {
      state: "relog_required",
      relogToken: tokenService.createRelogToken({
        sessionId,
        userId,
      }),
    };
  }

  if (newAuthToken) {
    return {
      state: "refreshed",
      newAuthToken,
    };
  }

  return {
    state: "authorized",
  };
}
