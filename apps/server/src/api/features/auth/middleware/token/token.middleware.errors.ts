import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("Authentication is required")
@withCode("api.auth.token.no_auth_cookie")
@withMetadata({ httpCode: 400 })
export class NoAuthCookieError extends ApiError {}
