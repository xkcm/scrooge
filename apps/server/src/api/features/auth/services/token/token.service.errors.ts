import {
  withCode,
  withMessage,
  withMetadata,
} from "@xkcm/better-errors";
import { ApiError } from "#shared/errors/ApiError.class.js";

@withMessage("Token is invalid")
@withCode("api.auth.token.invalid_token")
@withMetadata({ httpCode: 401 })
export class InvalidTokenError extends ApiError {}
