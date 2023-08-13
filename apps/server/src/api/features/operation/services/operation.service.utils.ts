import { Operation, Prisma } from "@prisma/client";
import { FilterRange, schemas } from "@scrooge/shared";

export const mapToPublicOperation = <
  T extends { [K in keyof schemas.operation.PublicOperation]: Operation[K] },
>(
  operation: T,
): schemas.operation.PublicOperation => ({
  ...operation,
  amount: operation.amount.toNumber(),
  createdAt: operation.createdAt.getTime(),
});

export const mapRangeFilterToPrismaFilter = (dateTimeFilter: FilterRange) => {
  const to = new Date(dateTimeFilter.to);
  const from = new Date(dateTimeFilter.from);
  const result: Prisma.DateTimeFilter = {};

  if (dateTimeFilter.includeFrom) {
    result.gte = from;
  } else {
    result.gt = from;
  }

  if (dateTimeFilter.includeTo) {
    result.lte = to;
  } else {
    result.lt = to;
  }

  return result;
};

export const createFullDayRangeFilter = (
  from: number,
  to: number,
): FilterRange => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  return {
    from: fromDate.getTime(),
    to: toDate.getTime(),
    includeFrom: true,
    includeTo: true,
  };
};
