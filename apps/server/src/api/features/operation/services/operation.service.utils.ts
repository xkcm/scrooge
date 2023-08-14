import { Operation, Prisma } from "@prisma/client";
import { RangeFilter } from "@scrooge/shared";

import { PUBLIC_OPERATION_SHAPE } from "../operation.consts.js";
import {
  OperationShape,
  PluckPublicOperation,
} from "./operation.service.types.js";

export const mapOperation = <O extends OperationShape>(
  operation: { [K in keyof typeof PUBLIC_OPERATION_SHAPE]: Operation[K] },
  operationShape: O,
): PluckPublicOperation<O> => {
  const parsedOperation = {
    ...operation,
    amount: operation.amount.toNumber(),
    createdAt: operation.createdAt.getTime(),
  };

  const pluckedOperation = Object.fromEntries(
    Object.entries(parsedOperation).filter(
      ([key]) => operationShape[key as keyof typeof operationShape],
    ),
  ) as PluckPublicOperation<O>;

  return pluckedOperation;
};

export const mapRangeFilterToPrismaFilter = (dateTimeFilter: RangeFilter) => {
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
): RangeFilter => {
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
