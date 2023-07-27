import { ApiErrorResponseBody } from "@scrooge/shared";

export type GetAuthInfoResponse =
  | {
      isAuthenticated: false;
      error: ApiErrorResponseBody;
    }
  | {
      isAuthenticated: true;
    };
