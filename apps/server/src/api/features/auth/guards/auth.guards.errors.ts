import { ApiError } from "@scrooge/shared";
import {
  BetterError,
  withCode,
  withMessage,
  withMetadata,
} from "@xkcm/better-errors";

@withMessage("Authenticated users are not allowed at this route")
@withCode("api.auth.authenticated_users_not_allowed")
@withMetadata({ httpCode: 400 })
export class AuthenticatedUsersNotAllowedError extends ApiError {}

@withMessage("Anonymous users are not allowed at this route")
@withCode("api.auth.anonymous_users_not_allowed")
@withMetadata({ httpCode: 400 })
export class AnonymousUsersNotAllowedError extends ApiError {}

@withMessage("Token middleware was not invoked before the Auth Guard")
@withCode("api.auth.token_middleware_required")
export class TokenMiddlewareRequiredError extends BetterError {}
