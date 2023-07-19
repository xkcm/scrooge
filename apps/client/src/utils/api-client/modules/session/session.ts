import { sendApiRequest } from "../../api-client.utils";
import { Session } from "./session.types";

export async function getActiveSessions(): Promise<Session[]> {
  const path = "auth/sessions";
  const method = "GET";

  const { body } = await sendApiRequest<Session[]>({
    path,
    method,
  });

  return body;
}
