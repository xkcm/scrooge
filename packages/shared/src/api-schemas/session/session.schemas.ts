import { z } from "zod";

export const InvalidateSessionBodySchema = z
  .object({
    sessionId: z.string().uuid(),
  })
  .strict();
