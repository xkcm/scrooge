import { FilterContainer, filters, schemas } from "@scrooge/shared";
import { sendApiRequest } from "../api-client.utils";

export async function getOperations(
  operationsFilters: filters.GetOperation = {},
) {
  const path = "operation";

  const filterContainer = FilterContainer.fromFilters(operationsFilters, {
    schema: filters.GetOperationsSchema,
  });

  const { body } =
    await sendApiRequest<schemas.operation.GetOperationsResponse>({
      method: "GET",
      path,
      query: filterContainer.toURLSearchParams(),
    });

  return body;
}

export async function getLatestOperations(incomes: number, expenses: number) {
  const path = "operation/latest";
  const query = new URLSearchParams([
    ["incomes", String(incomes)],
    ["expenses", String(expenses)],
  ]);

  const { body } =
    await sendApiRequest<schemas.operation.GetLatestOperationsResponse>({
      method: "GET",
      path,
      query,
    });

  return body;
}

export async function getOperationsPeriodSummary(
  operationFilters: filters.GetOperationsPeriodSummary,
) {
  const path = "operation/sum/period";
  const filterContainer = FilterContainer.fromFilters(operationFilters, {
    schema: filters.GetOperationsPeriodSummarySchema,
  });

  const { body } =
    await sendApiRequest<schemas.operation.GetOperationsPeriodSummaryResponse>({
      method: "GET",
      path,
      query: filterContainer.toURLSearchParams(),
    });

  return body;
}
