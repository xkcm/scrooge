import { schemas } from "@scrooge/shared";

import type {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";
import type { AuthLocals } from "#root/api/features/auth/middleware/token/token.middleware.types.js";
import sessionService from "#root/api/features/auth/services/session/session.service.js";

export const sessionController = {
  async getSessions(
    req,
    res: ApiResponse<schemas.session.GetSessionsResponse, AuthLocals>,
  ) {
    const { userId, sessionId } = res.locals.auth.token.payload;

    const sessions = await sessionService.getSessionsByUserId(userId);

    res.json({
      sessions: sessions.map((session) => ({
        ...session,
        lastUsed: session.lastUsed.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        createdAt: session.createdAt.toISOString(),
      })),
      current: sessionId,
    });
  },

  async invalidateSession(
    req: ApiRequest<{}, schemas.session.InvalidateSessionParams>,
    res: ApiResponse<{}, AuthLocals>,
  ) {
    const { sessionId } = req.params;
    const { userId } = res.locals.auth;

    await sessionService.invalidateSession(userId, sessionId);

    res.status(200).end();
  },

  async refreshSession(
    req: ApiRequest<{}, schemas.session.RefreshSessionParams>,
    res: ApiResponse<schemas.session.RefreshSessionResponse, AuthLocals>,
  ) {
    const { sessionId } = req.params;
    const { userId } = res.locals.auth.token.payload;

    const { expiresAt } = await sessionService.refreshSession(
      userId,
      sessionId,
    );

    res.json({ expiration: expiresAt.toISOString() });
  },
} satisfies ApiControllerObject;
