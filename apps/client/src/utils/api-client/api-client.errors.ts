import { ApiError } from "@scrooge/shared";
import { withCode, withMessage } from "@xkcm/better-errors";

@withMessage("Request failed")
@withCode("api.request_failed")
export class RequestFailedError extends ApiError {}
