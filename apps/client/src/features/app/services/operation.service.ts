import apiClient from "@/services/api-client/api-client";
import { filters } from "@scrooge/shared";

function getOperations(operationFilters?: filters.GetOperation) {
  return apiClient.operation.getOperations(operationFilters);
}

function getIncomeOperations(
  operationFilters?: Omit<filters.GetOperation, "operationType">,
) {
  return getOperations({
    ...operationFilters,
    operationType: "INCOME",
  });
}

function getExpenseOperations(
  operationFilters?: Omit<filters.GetOperation, "operationType">,
) {
  return getOperations({
    ...operationFilters,
    operationType: "EXPENSE",
  });
}

function getLatestOperations(incomes: number, expenses: number) {
  return apiClient.operation.getLatestOperations(incomes, expenses);
}

const operationService = {
  getOperations,
  getIncomeOperations,
  getExpenseOperations,
  getLatestOperations,
};

export default operationService;
