import { z } from "zod";

import { PaginationSchema, RangeFilterSchema } from "../filters.helpers.js";

export const GetOperationsSchema = z
  .object({
    createdAt: RangeFilterSchema.optional().describe("type=range"),
    operationType: z
      .enum(["INCOME", "EXPENSE"])
      .optional()
      .describe("type=string"),
    tags: z.array(z.string()).optional().describe("type=array"),
    orderKey: z.enum(["createdAt"]).optional().describe("type=string"),
    orderDirection: z.enum(["asc", "desc"]).optional().describe("type=string"),
  })
  .merge(PaginationSchema);

export const GetOperationsPeriodSummarySchema = z.object({
  periodGroup: z.enum(["day", "week", "month", "year"]).describe("type=string"),
  from: z.number().describe("type=number"),
  to: z.number().optional().describe("type=number"),
  timezone: z.number().describe("type=number"),
});

export type GetOperation = z.infer<typeof GetOperationsSchema>;
export type GetOperationsPeriodSummary = z.infer<
  typeof GetOperationsPeriodSummarySchema
>;
