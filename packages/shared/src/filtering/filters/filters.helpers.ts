import { z } from "zod";

export const FilterRangeSchema = z.object({
  from: z.number(),
  to: z.number(),
  includeFrom: z.boolean().optional(),
  includeTo: z.boolean().optional(),
});
