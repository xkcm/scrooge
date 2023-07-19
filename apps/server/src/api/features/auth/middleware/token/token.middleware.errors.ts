import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";
import { ApiError } from "#shared/errors/ApiError.class.js";

@withMessage("Auth cookie is required")
@withCode("api.auth.token.no_auth_cookie")
@withMetadata({ httpCode: 400 })
export class NoAuthCookieError extends ApiError {}
