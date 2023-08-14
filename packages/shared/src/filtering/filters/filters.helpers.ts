import { z } from "zod";

export const RangeFilterSchema = z
  .object({
    from: z.number(),
    to: z.number(),
    includeFrom: z.boolean().optional(),
    includeTo: z.boolean().optional(),
  })
  .describe("type=range");
