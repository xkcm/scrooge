import { schemas } from "@scrooge/shared";
import type { Router } from "express";
import express from "express";

import { wrapExpressErrorHandler } from "#root/api/errors/errors.utils.js";
import tokenMiddleware from "#root/api/features/auth/middleware/token/token.middleware.js";
import {
  createRequestBodyVerifier,
  createRequestParamsVerifier,
  createRequestQueryVerifier,
} from "#root/api/middleware/verifier.middleware.js";

import operationController from "./operation.controller.js";

const operationRouter: Router = express.Router();

operationRouter.get(
  "/",
  tokenMiddleware.strict,
  createRequestQueryVerifier({
    schema: schemas.operation.GetOperationsQuerySchema,
    allowEmptyObject: true,
  }),
  wrapExpressErrorHandler(operationController.getOperations),
);
operationRouter.delete(
  "/:operationId",
  tokenMiddleware.strict,
  createRequestParamsVerifier({
    schema: schemas.operation.DeleteOperationParamsSchema,
  }),
  wrapExpressErrorHandler(operationController.deleteOperation),
);
operationRouter.put(
  "/:operationId",
  tokenMiddleware.strict,
  createRequestBodyVerifier({
    schema: schemas.operation.ModifyOperationBodySchema,
  }),
  createRequestParamsVerifier({
    schema: schemas.operation.ModifyOperationParamsSchema,
  }),
  wrapExpressErrorHandler(operationController.modifyOperation),
);
operationRouter.get(
  "/sum",
  tokenMiddleware.strict,
  createRequestQueryVerifier({
    schema: schemas.operation.GetOperationsQuerySchema,
    allowEmptyObject: true,
  }),
  wrapExpressErrorHandler(operationController.getOperationsSum),
);

operationRouter.post(
  "/expense/add",
  tokenMiddleware.strict,
  createRequestBodyVerifier({
    schema: schemas.operation.AddOperationBodySchema,
  }),
  wrapExpressErrorHandler(operationController.addExpense),
);
operationRouter.post(
  "/income/add",
  tokenMiddleware.strict,
  createRequestBodyVerifier({
    schema: schemas.operation.AddOperationBodySchema,
  }),
  wrapExpressErrorHandler(operationController.addIncome),
);

export default operationRouter;
