import {
  BetterError,
  InferMetadata,
  setDefaultMergingBehavior,
  SupportedMetadata,
  withCode,
  withMessage,
  withMetadata,
} from "@xkcm/better-errors";

setDefaultMergingBehavior("compromise:submissive");

export interface ApiErrorAttachment {
  name?: string;
  type: "public" | "debug";
  data: any;
}

export interface ApiErrorResponseBody {
  code: string;
  message: string;
  attachments?: ApiErrorAttachment[];
}

@withMessage("Unknown server error occurred")
@withCode("api.unknown_server_error")
@withMetadata({ httpCode: 500 })
export class ApiError<M extends SupportedMetadata = {}> extends BetterError<
  {
    httpCode?: number;
    attachments?: ApiErrorAttachment[];
  } & M
> {
  public static fromApiResponse(
    apiResponse?: ApiErrorResponseBody,
    httpCode?: number,
  ) {
    const metadata: InferMetadata<ApiError> = {};
    if (apiResponse?.attachments) {
      metadata.attachments = apiResponse.attachments;
    }
    if (httpCode) {
      metadata.httpCode = httpCode;
    }

    const error = new ApiError({
      code: apiResponse?.code,
      message: apiResponse?.message,
      metadata,
    });

    return error;
  }

  public toApiResponse(): ApiErrorResponseBody {
    return {
      code: this.code,
      message: this.message,
      attachments: this.metadata.attachments?.filter(
        ({ type }) => type === "public",
      ),
    };
  }
}
