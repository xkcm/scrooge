import {
  withCode,
  withMessage,
  withMetadata,
} from "@xkcm/better-errors";
import { ApiError } from "#shared/errors/ApiError.class.js";

@withMessage("Session with id '%{metadata.sessionId}' can't be invalidated")
@withCode("api.auth.session.cant_invalidate_session")
@withMetadata({ httpCode: 401 })
export class CantInvalidateSessionError extends ApiError<{ sessionId?: string }> {}
@withMessage("Session is invalid")
@withCode("api.auth.session.invalid_session")
@withMetadata({ httpCode: 401 })
export class InvalidSessionError extends ApiError {}

@withMessage("Requester doesn't have sufficient permissions to refresh the sesion")
@withCode("api.auth.session.no_permissions_to_refresh_session")
@withMetadata({ httpCode: 403 })
export class NoPermissionsToRefreshSessionError extends ApiError {}

@withMessage("Session is not refreshable")
@withCode("api.auth.session.session_non_refreshable")
@withMetadata({ httpCode: 403 })
export class SessionNotRefreshableError extends ApiError {}
