import { Operation, Prisma } from "@prisma/client";
import type { FilterContainer, filters, schemas } from "@scrooge/shared";

export interface OperationService {
  addOperation(
    ownerId: Operation["ownerId"],
    operationType: Operation["type"],
    payload: Pick<
      Prisma.OperationCreateInput,
      "amount" | "description" | "createdAt" | "title"
    > & {
      tags?: Operation["tags"];
    },
  ): Promise<schemas.operation.PublicOperation>;

  getOperations(
    ownerId: Operation["ownerId"],
    filterContainer: FilterContainer<filters.GetOperation>,
  ): Promise<schemas.operation.PublicOperation[]>;
  getOperations<O extends OperationShape>(
    ownerId: Operation["ownerId"],
    filterContainer: FilterContainer<filters.GetOperation>,
    operationShape: O,
  ): Promise<PluckPublicOperation<O>[]>;
  getOperations<O extends OperationShape>(
    ownerId: Operation["ownerId"],
    filterContainer: FilterContainer<filters.GetOperation>,
    operationShape?: O,
  ): Promise<schemas.operation.PublicOperation[] | PluckPublicOperation<O>[]>;

  getOperationsByDate(
    ownerId: Operation["ownerId"],
    from: number,
    to: number,
  ): Promise<schemas.operation.PublicOperation[]>;

  getOperationById(
    operationId: Operation["id"],
  ): Promise<schemas.operation.PublicOperation>;

  deleteOperation(
    operationId: Operation["id"],
    requesterId: Operation["ownerId"],
  ): Promise<Operation["id"]>;

  modifyOperation(
    operationId: Operation["id"],
    ownerId: Operation["ownerId"],
    payload: Partial<
      Pick<Prisma.OperationUpdateInput, "amount" | "description" | "createdAt">
    > & {
      tags?: Operation["tags"];
    },
  ): Promise<schemas.operation.PublicOperation>;

  getOperationsSum(
    ownerId: Operation["ownerId"],
    from: number,
    to: number,
  ): Promise<schemas.operation.GetOperationsSumResponse>;

  getOperationsPeriodSummary(
    ownerId: Operation["ownerId"],
    filterContainer: FilterContainer<filters.GetOperationsSummary>,
  ): Promise<schemas.operation.GetOperationsSumResponse>;
}

export type OperationShape = Partial<Record<keyof Operation, boolean>>;
export type PluckPublicOperation<O extends OperationShape> = {
  [K in keyof schemas.operation.PublicOperation as O[K] extends true
    ? K
    : never]: schemas.operation.PublicOperation[K];
};
