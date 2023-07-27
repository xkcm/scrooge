import { Operation } from "@prisma/client";
import { z } from "zod";

import {
  AddOperationBodySchema,
  DeleteOperationParamsSchema,
  GetOperationsQuerySchema,
  ModifyOperationBodySchema,
  ModifyOperationParamsSchema,
} from "./operation.schemas.js";

export type GetOperationsQuery = z.infer<typeof GetOperationsQuerySchema>;
export type AddOperationBody = z.infer<typeof AddOperationBodySchema>;
export type DeleteOperationParams = z.infer<typeof DeleteOperationParamsSchema>;
export type ModifyOperationBody = z.infer<typeof ModifyOperationBodySchema>;
export type ModifyOperationParams = z.infer<typeof ModifyOperationParamsSchema>;

export type PublicOperation = Pick<Operation, "id" | "tags" | "description"> & {
  amount: number;
  createdAt: number;
};
export type GetOperationsSumResponse = {
  incomeSum: number;
  expenseSum: number;
};
export type DeleteOperationResponse = {
  id: PublicOperation["id"];
};
