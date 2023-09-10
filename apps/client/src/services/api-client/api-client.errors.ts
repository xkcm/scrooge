import { ApiError } from "@scrooge/shared";
import { withCode, withMessage } from "@xkcm/better-errors";

@withMessage("Failed to connect to the server")
@withCode("api.request_failed")
export class RequestFailedError extends ApiError {}
