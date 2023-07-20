import { Operation, Prisma } from "@prisma/client";

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
  ): Promise<PublicOperation>;

  getAllOperations(
    ownerId: Operation["ownerId"],
    filters?: Omit<
      NonNullable<Prisma.OperationFindManyArgs["where"]>,
      "ownerId"
    >,
  ): Promise<PublicOperation[]>;

  getOperationsByDate(
    ownerId: Operation["ownerId"],
    from: number,
    to: number,
  ): Promise<PublicOperation[]>;

  getOperationById(operationId: Operation["id"]): Promise<PublicOperation>;

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
  ): Promise<PublicOperation>;

  getOperationsSum(
    ownerId: Operation["ownerId"],
    from: number,
    to: number,
  ): Promise<{
    incomeSum: number;
    expenseSum: number;
  }>;
}

export type PublicOperation = Pick<Operation, "id" | "tags" | "description"> & {
  amount: number;
  createdAt: number;
};
