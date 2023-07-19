import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";
import { ApiError } from "#shared/errors/ApiError.class.js";

@withMessage("Operation with id '%{metadata.operationId}' doesn't exist")
@withCode("api.operation.invalid_operation")
@withMetadata({ httpCode: 400 })
export class InvalidOperationIdError extends ApiError<{ operationId?: string }> {}

@withMessage("Operation with id '%{metadata.operationId}' can't be deleted")
@withCode("api.operation.cant_delete_operation")
@withMetadata({ httpCode: 403 })
export class CantDeleteOperationError extends ApiError<{ operationId?: string }> {}
