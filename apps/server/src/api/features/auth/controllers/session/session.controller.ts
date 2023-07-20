import type {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";
import type { AuthLocals } from "#root/api/features/auth/middleware/token/token.middleware.types.js";
import sessionService from "#root/api/features/auth/services/session/session.service.js";

import { InvalidateSessionParams } from "../../auth.schemas.js";

export const sessionController = {
  async getSessions(req, res: ApiResponse<AuthLocals>) {
    const { userId } = res.locals.auth.token.payload;

    const sessions = await sessionService.getSessionsByUserId(userId);

    res.json(sessions);
  },

  async invalidateSession(
    req: ApiRequest<{}, InvalidateSessionParams>,
    res: ApiResponse<AuthLocals>,
  ) {
    const { sessionId } = req.params;
    const { userId } = res.locals.auth;

    await sessionService.invalidateSession(userId, sessionId);

    res.status(200).end();
  },

  async refreshSession(req, res: ApiResponse<AuthLocals>) {
    const { sessionId, userId } = res.locals.auth.token.payload;

    const { expiresAt } = await sessionService.refreshSession(userId, sessionId);

    res.json({ newExpiryDate: expiresAt.toDateString() });
  },
} satisfies ApiControllerObject;
