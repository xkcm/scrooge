import { User, Session } from "@prisma/client";

export interface SessionInputInfo {
  geolocation?: [number, number];
  agent?: string;
  sourceIp?: string;
}

export type PublicSession = Pick<Session, "agent" | "createdAt" | "expiresAt" | "geolocation" | "id" | "sourceIp">;

export interface SessionService {
  createSession(userId: User["id"], sessionInfo: SessionInputInfo): Promise<Session>;

  getSessionsByUserId(userId: User["id"]): Promise<PublicSession[]>;

  getSessionById(sessionId: Session["id"]): Promise<Session>;

  invalidateSession(userId: User["id"], sessionId: Session["id"]): Promise<{
    count: number;
    invalidated: true;
  }>;

  refreshSession(userId: User["id"], sessionId: Session["id"]): Promise<Session>;

  verifySessionById(userId: User["id"], sessionId: Session["id"]): Promise<boolean>;
}
