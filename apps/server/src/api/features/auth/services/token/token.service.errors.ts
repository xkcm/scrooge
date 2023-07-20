import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("Token is invalid")
@withCode("api.auth.token.invalid_token")
@withMetadata({ httpCode: 401 })
export class InvalidTokenError extends ApiError {}
