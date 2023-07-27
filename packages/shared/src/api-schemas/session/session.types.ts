import { Session } from "@prisma/client";
import { z } from "zod";

import { InvalidateSessionParamsSchema } from "./session.schemas.js";

export type InvalidateSessionBody = z.infer<
  typeof InvalidateSessionParamsSchema
>;

export type RefreshSessionResponse = {
  newExpiryDate: string;
};

export type PublicSession = Pick<
  Session,
  "agent" | "createdAt" | "expiresAt" | "geolocation" | "id" | "sourceIp"
>;
export type GetSessionsResponse = PublicSession[];
