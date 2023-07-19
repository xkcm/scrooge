import { ApiError } from "@shared/errors/ApiError.class";
import { withCode, withMessage } from "@xkcm/better-errors";

@withMessage("Request failed")
@withCode("api.request_failed")
export class RequestFailedError extends ApiError {}
