import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";
import { ApiError } from "#shared/errors/ApiError.class.js";

@withMessage("Login attempt failed, email or password is incorrect")
@withCode("api.user.login_attempt_failed")
@withMetadata({ httpCode: 403 })
export class LoginAttemptFailedError extends ApiError {}
