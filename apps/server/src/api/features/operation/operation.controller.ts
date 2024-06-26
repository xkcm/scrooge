import { filters, schemas } from "@scrooge/shared";

import {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";
import { AuthLocals } from "#root/api/features/auth/middleware/token/token.middleware.types.js";

import { LATEST_OPERATION_SHAPE } from "./operation.consts.js";
import {
  createFilterContainerFromFiltersAndMapError,
  createFilterContainerFromStringAndMapError,
} from "./operation.controller.utils.js";
import operationService from "./services/operation.service.js";

export const operationController = {
  async addExpense(
    req: ApiRequest<schemas.operation.AddOperationBody>,
    res: ApiResponse<schemas.operation.PublicOperation, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;

    const createdOperation = await operationService.addOperation(
      userId,
      "EXPENSE",
      req.body,
    );

    return res.json(createdOperation);
  },

  async addIncome(
    req: ApiRequest<schemas.operation.AddOperationBody>,
    res: ApiResponse<schemas.operation.PublicOperation, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;

    const createdOperation = await operationService.addOperation(
      userId,
      "INCOME",
      req.body,
    );

    return res.json(createdOperation);
  },

  async getOperations(
    req: ApiRequest<{}, {}, schemas.operation.GetOperationsQuery>,
    res: ApiResponse<schemas.operation.GetOperationsResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;

    const filterContainer = createFilterContainerFromStringAndMapError(
      req.query?.filter,
      {
        schema: filters.GetOperationsSchema,
      },
    );

    const operations = await operationService.getOperations(
      userId,
      filterContainer,
    );

    return res.json({ operations });
  },

  async deleteOperation(
    req: ApiRequest<{}, schemas.operation.DeleteOperationParams>,
    res: ApiResponse<schemas.operation.DeleteOperationResponse, AuthLocals>,
  ) {
    const { operationId } = req.params;
    const { userId } = res.locals.auth;

    const deletedOperationId = await operationService.deleteOperation(
      userId,
      operationId,
    );

    res.json({ id: deletedOperationId });
  },

  async modifyOperation(
    req: ApiRequest<
      schemas.operation.ModifyOperationBody,
      schemas.operation.ModifyOperationParams
    >,
    res: ApiResponse<schemas.operation.PublicOperation, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const { operationId } = req.params;

    const updatedOperation = await operationService.modifyOperation(
      operationId,
      userId,
      req.body,
    );

    res.json(updatedOperation);
  },

  async getOperationsSum(
    req: ApiRequest<{}, {}, schemas.operation.GetOperationsQuery>,
    res: ApiResponse<schemas.operation.GetOperationsSumResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const filter = createFilterContainerFromStringAndMapError(
      req.query?.filter,
      {
        schema: filters.GetOperationsSchema,
      },
    );

    const { from, to } = filter.getFilter("createdAt", {
      from: Date.now() - 60 * 60 * 24,
      to: Date.now(),
    });

    const operationsSum = await operationService.getOperationsSum(
      userId,
      from,
      to,
    );

    res.json(operationsSum);
  },

  async getLatestOperations(
    req: ApiRequest<{}, {}, schemas.operation.GetLatestOperationsQuery>,
    res: ApiResponse<schemas.operation.GetLatestOperationsResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;

    const filterContainer = createFilterContainerFromFiltersAndMapError(
      {},
      {
        schema: filters.GetOperationsSchema,
      },
    );

    filterContainer.setNumberFilter("limit", req.query.incomes);
    filterContainer.setStringFilter("operationType", "INCOME");
    const incomes = await operationService.getOperations(
      userId,
      filterContainer,
      LATEST_OPERATION_SHAPE,
    );

    filterContainer.setNumberFilter("limit", req.query.expenses);
    filterContainer.setStringFilter("operationType", "EXPENSE");
    const expenses = await operationService.getOperations(
      userId,
      filterContainer,
      LATEST_OPERATION_SHAPE,
    );

    res.json({ incomes, expenses });
  },

  async getOperationsPeriodSummary(
    req: ApiRequest<{}, {}, schemas.operation.GetOperationsPeriodSummaryQuery>,
    res: ApiResponse<
      schemas.operation.GetOperationsPeriodSummaryResponse,
      AuthLocals
    >,
  ) {
    const { userId } = res.locals.auth;

    const filter = createFilterContainerFromStringAndMapError(
      req.query?.filter,
      {
        schema: filters.GetOperationsPeriodSummarySchema,
      },
    );

    const operationsSummary = await operationService.getOperationsPeriodSummary(
      userId,
      filter,
    );

    res.json(operationsSummary);
  },
} satisfies ApiControllerObject;

export default operationController;
