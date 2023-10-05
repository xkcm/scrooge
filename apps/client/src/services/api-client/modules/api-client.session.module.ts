import { schemas } from "@scrooge/shared";
import { sendApiRequest } from "../api-client.utils";

export async function getActiveSessions(): Promise<schemas.session.GetSessionsResponse> {
  const path = "auth/sessions";
  const method = "GET";

  const { body } = await sendApiRequest<schemas.session.GetSessionsResponse>({
    path,
    method,
  });

  return body;
}
