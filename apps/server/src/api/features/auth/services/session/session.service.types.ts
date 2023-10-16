import { Session, User } from "@prisma/client";
import { schemas } from "@scrooge/shared";

export interface SessionInputInfo {
  geolocation?: [number, number];
  agent?: string;
  sourceIp?: string;
}

export interface SessionService {
  createSession(
    userId: User["id"],
    sessionInfo: SessionInputInfo,
  ): Promise<Session>;

  getSessionsByUserId(
    userId: User["id"],
  ): Promise<Array<schemas.session.PublicSession & { lastUsed: Date }>>;

  getSession(
    userId: Session["userId"],
    sessionId: Session["id"],
  ): Promise<Session>;

  invalidateSession(
    userId: User["id"],
    sessionId: Session["id"],
  ): Promise<{
    count: number;
    invalidated: true;
  }>;

  tryInvalidateSession(
    userId: User["id"],
    sessionId: Session["id"],
  ): Promise<void>;

  refreshSession(
    userId: User["id"],
    sessionId: Session["id"],
  ): Promise<Session>;

  verifySession(userId: User["id"], sessionId: Session["id"]): Promise<boolean>;
}
