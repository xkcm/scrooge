import { Session } from "@prisma/client";

export const isSessionInvalid = (session: Session) => (session.expiresAt.getTime() <= Date.now());
