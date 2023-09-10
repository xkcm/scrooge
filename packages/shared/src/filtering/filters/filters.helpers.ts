import { z } from "zod";

export const RangeFilterSchema = z
  .object({
    from: z.number(),
    to: z.number(),
    includeFrom: z.boolean().optional(),
    includeTo: z.boolean().optional(),
  })
  .describe("type=range");

export const PaginationSchema = z.object({
  limit: z.number().optional().describe("type=number"),
  offset: z.number().optional().describe("type=number"),
});
