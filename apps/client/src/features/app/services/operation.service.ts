import apiClient from "@/services/api-client/api-client";
import { filters } from "@scrooge/shared";

function getOperations(operationFilters?: filters.GetOperationFilterQuery) {
  return apiClient.operation.getOperations(operationFilters);
}

function getIncomeOperations(
  operationFilters?: Omit<filters.GetOperationFilterQuery, "operationType">,
) {
  return getOperations({
    ...operationFilters,
    operationType: "INCOME",
  });
}

function getExpenseOperations(
  operationFilters?: Omit<filters.GetOperationFilterQuery, "operationType">,
) {
  return getOperations({
    ...operationFilters,
    operationType: "EXPENSE",
  });
}

const operationService = {
  getOperations,
  getIncomeOperations,
  getExpenseOperations,
};

export default operationService;
