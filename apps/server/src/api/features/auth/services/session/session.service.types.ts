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
  ): Promise<schemas.session.PublicSession[]>;

  getSessionById(sessionId: Session["id"]): Promise<Session>;

  invalidateSession(
    userId: User["id"],
    sessionId: Session["id"],
  ): Promise<{
    count: number;
    invalidated: true;
  }>;

  refreshSession(
    userId: User["id"],
    sessionId: Session["id"],
  ): Promise<Session>;

  verifySessionById(
    userId: User["id"],
    sessionId: Session["id"],
  ): Promise<boolean>;
}
