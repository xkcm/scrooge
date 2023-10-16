import { Session } from "@prisma/client";
import { z } from "zod";

import {
  InvalidateSessionParamsSchema,
  RefreshSessionParamsSchema,
} from "./session.schemas.js";

export type PublicSession = Pick<
  Session,
  | "agent"
  | "createdAt"
  | "expiresAt"
  | "geolocation"
  | "id"
  | "sourceIp"
  | "refreshable"
>;

export type InvalidateSessionParams = z.infer<
  typeof InvalidateSessionParamsSchema
>;

export type RefreshSessionParams = z.infer<typeof RefreshSessionParamsSchema>;

export type RefreshSessionResponse = {
  expiration: string;
};

export type GetSessionsResponse = {
  sessions: (Omit<PublicSession, "expiresAt" | "createdAt" | "lastUsed"> & {
    expiresAt: string;
    createdAt: string;
    lastUsed: string;
  })[];
  current: PublicSession["id"];
};
