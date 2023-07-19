import { ApiErrorResponseBody } from "@shared/errors/ApiError.class";

export type GetAuthInfoResponse =
  | {
      isAuthenticated: false;
      error: ApiErrorResponseBody;
    }
  | {
      isAuthenticated: true;
    };
