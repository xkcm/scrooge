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

export async function invalidateSession(
  sessionId: schemas.session.InvalidateSessionParams["sessionId"],
): Promise<null> {
  const path = `auth/session/${sessionId}`;
  const method = "DELETE";

  const { body } = await sendApiRequest<null>({
    path,
    method,
    expectEmptyBody: true,
  });

  return body;
}

export async function refreshSession(
  sessionId: schemas.session.RefreshSessionParams["sessionId"],
) {
  const path = `auth/session/${sessionId}`;
  const method = "PATCH";

  const { body } = await sendApiRequest<schemas.session.RefreshSessionResponse>(
    {
      path,
      method,
    },
  );

  return body;
}
