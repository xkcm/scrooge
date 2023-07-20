import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("Undefined tag(s): %{metadata.tags}")
@withCode("api.operation.undefined_tag")
@withMetadata({ httpCode: 400 })
export class UndefinedTagError extends ApiError<{ tags?: string }> {}
