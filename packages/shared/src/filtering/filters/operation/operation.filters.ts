import { z } from "zod";

import {
  FilterEnumSchema,
  FilterNumberSchema,
  FilterRangeSchema,
} from "../filters.helpers.js";

export const GetOperationsFilterQuerySchema = z.object({
  createdAt: FilterRangeSchema.optional(),
  operationType: FilterEnumSchema.create(["INCOME", "EXPENSE", "ALL"]),
  sortBy: FilterEnumSchema.create(["createdAt"]).optional(),
  limit: FilterNumberSchema.optional(),
  offset: FilterNumberSchema.optional(),
});

export type GetOperationFilterQuery = z.infer<
  typeof GetOperationsFilterQuerySchema
>;
