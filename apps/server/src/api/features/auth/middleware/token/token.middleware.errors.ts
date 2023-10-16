import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("Authentication token is not present in the request")
@withCode("api.auth.token.no_auth_cookie")
@withMetadata({ httpCode: 400 })
export class NoAuthTokenError extends ApiError {}

@withMessage("Refresh token is not present in the request")
@withCode("api.auth.token.no_refresh_cookie")
@withMetadata({ httpCode: 400 })
export class NoRefreshTokenError extends ApiError {}

@withMessage("Authorization did not succeed, please re-log")
@withCode("api.auth.token.relog_required")
@withMetadata({ httpCode: 403 })
export class RelogRequiredError extends ApiError {}

@withMessage("Session ID is mismatched in refresh and auth token")
@withCode("api.auth.token.session_mismatch")
@withMetadata({ httpCode: 400 })
export class SessionIdMismatchError extends ApiError {}

@withMessage("User ID is mismatched in refresh and auth token")
@withCode("api.auth.token.session_mismatch")
@withMetadata({ httpCode: 400 })
export class UserIdMismatchError extends ApiError {}

@withMessage("Unrecognized auth flow state: %{metadata.state}")
@withCode("api.auth.token.invalid_auth_state")
@withMetadata({ httpCode: 500 })
export class UnrecognizedAuthFlowStateError extends ApiError<{
  state?: string;
}> {}
