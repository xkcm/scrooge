import { Operation } from "@prisma/client";

import { PublicOperation } from "./operation.service.types.js";

export const mapToPublicOperation = <
  T extends { [K in keyof PublicOperation]: Operation[K] },
>(
  operation: T,
): PublicOperation => ({
  ...operation,
  amount: operation.amount.toNumber(),
  createdAt: operation.createdAt.getTime(),
});

export const createFullDayDatePrismaFilter = (from: number, to: number) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  return {
    gte: fromDate,
    lte: toDate,
  };
};
