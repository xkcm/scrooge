import { z } from "zod";

import { NumericStringSchema } from "../api-schemas.utils.js";

export const GetOperationsQuerySchema = z
  .object({
    filter: z.string(),
  })
  .optional();

export const AddOperationBodySchema = z
  .object({
    title: z.string(),
    amount: z.number().positive(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    createdAt: z
      .number()
      .transform((time) => new Date(time))
      .optional(),
  })
  .strict();

export const DeleteOperationParamsSchema = z
  .object({
    operationId: z.string().uuid(),
  })
  .strict();

export const ModifyOperationBodySchema = z
  .object({
    createdAt: z.number().transform((time) => new Date(time)),
    amount: z.number().positive(),
    tags: z.array(z.string()),
    description: z.string(),
  })
  .partial()
  .strict();

export const ModifyOperationParamsSchema = z
  .object({
    operationId: z.string().uuid(),
  })
  .strict();

export const GetLatestOperationsQuerySchema = z
  .object({
    incomes: NumericStringSchema,
    expenses: NumericStringSchema,
  })
  .strict();

export const GetOperationsPeriodSummaryQuerySchema = GetOperationsQuerySchema;
