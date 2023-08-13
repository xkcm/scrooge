import { z } from "zod";

import { FilterRangeSchema } from "../filters.helpers.js";

export const GetOperationsFilterQuerySchema = z.object({
  createdAt: FilterRangeSchema.optional().describe("type=range"),
  operationType: z.enum(["INCOME", "EXPENSE", "ALL"]).describe("type=string"),
  orderKey: z.enum(["createdAt"]).optional().describe("type=string"),
  orderDirection: z.enum(["asc", "desc"]).optional().describe("type=string"),
  limit: z.number().optional().describe("type=number"),
  offset: z.number().optional().describe("type=number"),
});

export type GetOperationFilterQuery = z.infer<
  typeof GetOperationsFilterQuerySchema
>;
