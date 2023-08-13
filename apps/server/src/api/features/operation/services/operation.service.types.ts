import { Operation, Prisma } from "@prisma/client";
import { schemas } from "@scrooge/shared";

export interface OperationService {
  addOperation(
    ownerId: Operation["ownerId"],
    operationType: Operation["type"],
    payload: Pick<
      Prisma.OperationCreateInput,
      "amount" | "description" | "createdAt"
    > & {
      tags?: Operation["tags"];
    },
  ): Promise<schemas.operation.PublicOperation>;

  getAllOperations(
    ownerId: Operation["ownerId"],
    filters?: Omit<K<Prisma.OperationFindManyArgs["where"]>, "ownerId">,
  ): Promise<schemas.operation.PublicOperation[]>;

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
}
