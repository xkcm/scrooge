import { schemas } from "@scrooge/shared";
import { sendApiRequest } from "../api-client.utils";

export async function getInfo(): Promise<schemas.user.GetUserInfoResponse> {
  const path = "user/info";
  const method = "GET";

  const { body } = await sendApiRequest<schemas.user.GetUserInfoResponse>({
    path,
    method,
  });

  return body;
}
