import { ApiError, schemas } from "@scrooge/shared";
import hashJs from "hash.js";

import { sendApiRequest } from "../api-client.utils.js";

export async function logIn(
  mail: string,
  password: string,
): Promise<schemas.auth.LoginResponse> {
  const path = "auth/login";
  const requestPayload = {
    email: mail,
    password: hashJs.sha256().update(password).digest("hex"),
  };

  const { body } = await sendApiRequest<schemas.auth.LoginResponse>({
    body: requestPayload,
    path,
  });

  return body;
}

export async function logOut(): Promise<schemas.auth.GetAuthStateResponse> {
  const path = "auth/logout";

  const { body } = await sendApiRequest<schemas.auth.GetAuthStateResponse>({
    path,
  });

  return body;
}

export async function getAuthState(): Promise<schemas.auth.GetAuthStateResponse> {
  const path = "auth/state";

  const { body, response } =
    await sendApiRequest<schemas.auth.GetAuthStateResponse>({
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
