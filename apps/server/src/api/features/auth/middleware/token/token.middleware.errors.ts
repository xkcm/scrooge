import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("Authentication cookie is not present")
@withCode("api.auth.token.no_auth_cookie")
@withMetadata({ httpCode: 400 })
export class NoAuthCookieError extends ApiError {}

@withMessage("Refresh cookie is not present")
@withCode("api.auth.token.no_refresh_cookie")
@withMetadata({ httpCode: 400 })
export class NoRefreshCookieError extends ApiError {}

@withMessage("Refresh Token is expired, please re-log")
@withCode("api.auth.token.relog_required")
@withMetadata({ httpCode: 403 })
export class RefreshTokenExpiredError extends ApiError<{
  sessionId?: string;
  userId?: string;
}> {}
