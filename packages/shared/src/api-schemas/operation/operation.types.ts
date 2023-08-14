import { z } from "zod";

import { filters } from "../../filtering/filtering.js";
import {
  AddOperationBodySchema,
  DeleteOperationParamsSchema,
  GetLatestOperationsQuerySchema,
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
export type GetLatestOperationsQuery = z.infer<
  typeof GetLatestOperationsQuerySchema
>;

export type GetOperationsResponse = { operations: PublicOperation[] };
export type GetOperationsSumResponse = {
  incomeSum: number;
  expenseSum: number;
};
export type DeleteOperationResponse = {
  id: PublicOperation["id"];
};
export type GetLatestOperationsResponse = {
  [key in "incomes" | "expenses"]: LatestOperation[];
};
export type GetOperationsPeriodSummaryResponse = {
  income: SummaryItem;
  expense: SummaryItem;
  from: number;
  to: number;
  periodGroup: filters.GetOperationsPeriodSummary["periodGroup"];
};

export type PublicOperation = {
  title: string;
  id: string;
  tags: string[];
  amount: number;
  createdAt: number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
};
export type LatestOperation = Pick<
  PublicOperation,
  "id" | "title" | "amount" | "createdAt" | "type" | "tags"
>;
type SummaryItem = {
  sum: number;
  entries: {
    date: number;
    sum: number;
  }[];
};
