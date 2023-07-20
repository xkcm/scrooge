import hashJs from "hash.js";

import { sendApiRequest } from "../../api-client.utils";
import type { JwtTokensState } from "../../api-client.types";
import { ApiError } from "@scrooge/shared";
import { GetAuthInfoResponse } from "./auth.types";

export async function login(
  mail: string,
  password: string,
): Promise<JwtTokensState> {
  // TODO: Improve error handling (recognize error codes etc)
  const path = "auth/login";
  const requestPayload = {
    email: mail,
    password: hashJs.sha256().update(password).digest("hex"),
  };

  const { body } = await sendApiRequest<JwtTokensState>({
    body: requestPayload,
    path,
  });

  return body;
}

export async function getAuthState(): Promise<GetAuthInfoResponse> {
  const path = "auth/state";

  const { body, response } = await sendApiRequest<GetAuthInfoResponse>({
    ignoreBadStatusCode: true,
    method: "GET",
    path,
  });

  if (!body.isAuthenticated) {
    return {
      isAuthenticated: false,
      error: ApiError.fromApiResponse(body.error, response.status),
    };
  }

  return body;
}
