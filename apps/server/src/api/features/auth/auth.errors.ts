import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("Email or password is incorrect")
@withCode("api.user.login_attempt_failed")
@withMetadata({ httpCode: 403 })
export class LoginAttemptFailedError extends ApiError {}

@withMessage("No auth tokens present")
@withCode("api.auth.empty_auth")
@withMetadata({ httpCode: 401 })
export class EmptyAuthError extends ApiError {}
