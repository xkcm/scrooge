import { z } from "zod";

import { FilterRangeSchema } from "../filters.helpers.js";

type InferFilterFromSchema<S extends Zod.ZodRawShape> = z.infer<z.ZodObject<S>>;

export const GetOperationsSchema = {
  createdAt: FilterRangeSchema.optional(),
  operationType: z.enum(["INCOME", "EXPENSE", "ALL"]).optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  limit: z.number().optional(),
  offset: z.number(),
};
export type GetOperationsFilter = InferFilterFromSchema<
  typeof GetOperationsSchema
>;
