import moment from "moment";
import { z } from "zod";

import { NumericStringSchema } from "../api-schemas.utils.js";

export const GetOperationsQuerySchema = z
  .object({
    from: NumericStringSchema,
    to: NumericStringSchema,
  })
  .optional()
  .default(() => ({
    from: moment().subtract(1, "week").valueOf().toString(),
    to: moment().valueOf().toString(),
  }));

export const AddOperationBodySchema = z
  .object({
    amount: z.number().positive(),
    description: z.string(),
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
