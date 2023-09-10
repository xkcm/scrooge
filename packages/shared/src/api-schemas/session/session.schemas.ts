import { z } from "zod";

export const InvalidateSessionParamsSchema = z
  .object({
    sessionId: z.string().cuid(),
  })
  .strict();
