import { z } from "zod";

import { RangeFilterSchema } from "../filters.helpers.js";

export const GetOperationsSchema = z.object({
  createdAt: RangeFilterSchema.optional().describe("type=range"),
  operationType: z
    .enum(["INCOME", "EXPENSE"])
    .optional()
    .describe("type=string"),
  orderKey: z.enum(["createdAt"]).optional().describe("type=string"),
  orderDirection: z.enum(["asc", "desc"]).optional().describe("type=string"),
  limit: z.number().optional().describe("type=number"),
  offset: z.number().optional().describe("type=number"),
  tags: z.array(z.string()).optional().describe("type=array"),
});

export const GetOperationsPeriodSummarySchema = z.object({
  periodGroup: z.enum(["day", "week", "month", "year"]).describe("type=string"),
  limit: z.number().optional().describe("type=number"),
});

export type GetOperation = z.infer<typeof GetOperationsSchema>;
export type GetOperationsSummary = z.infer<
  typeof GetOperationsPeriodSummarySchema
>;
