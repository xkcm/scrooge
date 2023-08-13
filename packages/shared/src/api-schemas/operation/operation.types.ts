import { z } from "zod";

import {
  AddOperationBodySchema,
  DeleteOperationParamsSchema,
  GetOperationsPeriodSummaryQuerySchema,
  GetOperationsQuerySchema,
  ModifyOperationBodySchema,
  ModifyOperationParamsSchema,
} from "./operation.schemas.js";

export type GetOperationsQuery = z.infer<typeof GetOperationsQuerySchema>;
export type AddOperationBody = z.infer<typeof AddOperationBodySchema>;
export type DeleteOperationParams = z.infer<typeof DeleteOperationParamsSchema>;
export type ModifyOperationBody = z.infer<typeof ModifyOperationBodySchema>;
export type ModifyOperationParams = z.infer<typeof ModifyOperationParamsSchema>;
export type GetOperationsPeriodSummaryQuery = z.infer<
  typeof GetOperationsPeriodSummaryQuerySchema
>;

export type PublicOperation = {
  title: string;
  id: string;
  tags: string[];
  amount: number;
  createdAt: number;
  type: "INCOME" | "EXPENSE";
  description?: string | null;
};
export type GetOperationsSumResponse = {
  incomeSum: number;
  expenseSum: number;
};
export type DeleteOperationResponse = {
  id: PublicOperation["id"];
};
export type GetOperationsPeriodSummaryResponse = {};
