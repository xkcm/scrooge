import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";
import { ApiError } from "@scrooge/shared";

@withMessage("Request body is invalid")
@withCode("api.invalid_request_body")
@withMetadata({ httpCode: 400 })
export class InvalidRequestBodyError extends ApiError {}

@withMessage("Request URL params are invalid")
@withCode("api.invalid_request_params")
@withMetadata({ httpCode: 400 })
export class InvalidRequestParamsError extends ApiError {}

@withMessage("Request cookies are invalid")
@withCode("api.invalid_request_cookies")
@withMetadata({ httpCode: 400 })
export class InvalidRequestCookiesError extends ApiError {}

@withMessage("Request query is invalid")
@withCode("api.invalid_request_query")
@withMetadata({ httpCode: 400 })
export class InvalidRequestQueryError extends ApiError {}

@withMessage("Endpoint %{metadata.endpoint} doesn't exist")
@withCode("api.endpoint_not_found")
@withMetadata({ httpCode: 404 })
export class EndpointNotFoundError extends ApiError<{ endpoint?: string }> {}
