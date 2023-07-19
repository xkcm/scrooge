import moment from "moment";
import { z } from "zod";
import { NumericStringSchema } from "#core/utils/schemas.utils.js";

export const OperationDateFilterSchema = z.object({
  from: NumericStringSchema,
  to: NumericStringSchema,
}).optional().default(() => ({
  from: moment().subtract(1, "week").valueOf().toString(),
  to: moment().valueOf().toString(),
}));

export const AddOperationSchema = z.object({
  amount: z.number().positive(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  createdAt: z.number().transform((time) => new Date(time)).optional(),
}).strict();

export const DeleteOperationSchema = z.object({
  operationId: z.string().uuid(),
}).strict();

export const ModifyOperationSchema = {
  BODY: z.object({
    createdAt: z.number().transform((time) => new Date(time)),
    amount: z.number().positive(),
    tags: z.array(z.string()),
    description: z.string(),
  }).partial().strict(),
  PARAMS: z.object({
    operationId: z.string().uuid(),
  }).strict(),
};

export type OperationDateFilter = z.infer<typeof OperationDateFilterSchema>;
export type AddOperationBody = z.infer<typeof AddOperationSchema>;
export type DeleteOperationParams = z.infer<typeof DeleteOperationSchema>;
export namespace ModifyOperation {
  export type BODY = z.infer<typeof ModifyOperationSchema["BODY"]>;
  export type PARAMS = z.infer<typeof ModifyOperationSchema["PARAMS"]>;
}
