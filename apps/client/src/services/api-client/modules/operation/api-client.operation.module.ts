import { QueryFilter, filters, schemas } from "@scrooge/shared";
import { sendApiRequest } from "../../api-client.utils";

export async function getOperations(
  operationsFilters: filters.GetOperationFilterQuery = {},
) {
  const path = "operation/";

  const queryFilter = QueryFilter.fromFilters(
    operationsFilters,
    filters.GetOperationsFilterQuerySchema,
  );

  const { body } = await sendApiRequest<schemas.operation.PublicOperation[]>({
    method: "GET",
    path,
    query: queryFilter.toURLSearchParams(),
  });

  return body;
}
