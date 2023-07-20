import { Session } from "@prisma/client";

type SessionCacheInfoProperty = "last_used";

export interface SessionRedisService {
  saveSessionInfo(
    sessionId: Session["id"],
    property: SessionCacheInfoProperty,
    value: string | number,
  ): Promise<number>;

  getSessionInfo(
    sessionId: Session["id"],
    property: SessionCacheInfoProperty,
  ): Promise<string | undefined>;

  getAllSessionInfo(sessionId: Session["id"]): Promise<{
    lastUsed: Date;
  }>;

  removeAllSessionInfo(sessionId: Session["id"]): Promise<number>;
}
