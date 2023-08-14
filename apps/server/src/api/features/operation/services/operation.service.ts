import { Operation, Prisma } from "@prisma/client";
import { FilterContainer, filters } from "@scrooge/shared";

import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
import { UserWithGivenIdNotFoundError } from "#root/api/features/auth/services/user/user.service.errors.js";
import tagsService from "#root/api/features/tags/services/tags/tags.service.js";
import { removeDuplicates } from "#root/core/utils/utils.js";

import { PUBLIC_OPERATION_SHAPE } from "../operation.consts.js";
import {
  CantDeleteOperationError,
  InvalidOperationIdError,
} from "../operation.errors.js";
import { OperationService } from "./operation.service.types.js";
import {
  createFullDayRangeFilter,
  mapOperation,
  mapRangeFilterToPrismaFilter,
} from "./operation.service.utils.js";

const operationService: OperationService = {
  async addOperation(ownerId, type, payload) {
    if (payload.tags) {
      await tagsService.assertUserTags(ownerId, payload.tags);
    }

    const createdOperation = await prismaClient.operation
      .create({
        data: {
          title: payload.title,
          description: payload.description,
          amount: payload.amount,
          tags: payload.tags,
          type,
          owner: {
            connect: {
              id: ownerId,
            },
          },
        },
        select: PUBLIC_OPERATION_SHAPE,
      })
      .catch(
        createPrismaErrorParser({
          P2025: UserWithGivenIdNotFoundError.withMetadata({ userId: ownerId }),
        }),
      );

    return mapOperation(createdOperation, PUBLIC_OPERATION_SHAPE);
  },

  async getOperations(
    ownerId: Operation["id"],
    filterContainer: FilterContainer<filters.GetOperation>,
    operationShape = PUBLIC_OPERATION_SHAPE,
  ) {
    const where: Prisma.OperationWhereInput = {
      ownerId,
    };

    const type = filterContainer.getFilter("operationType");
    if (type) {
      where.type = type;
    }

    const createdAt = filterContainer.getFilter("createdAt");
    if (createdAt) {
      where.createdAt = mapRangeFilterToPrismaFilter(createdAt);
    }

    const limit = filterContainer.getFilter("limit", 20);
    const offset = filterContainer.getFilter("offset", 0);

    const orderKey = filterContainer.getFilter("orderKey", "createdAt");
    const orderDirection = filterContainer.getFilter("orderDirection", "desc");

    const prismaArgs: Prisma.OperationFindManyArgs = {
      where,
      select: operationShape,
      orderBy: {
        [orderKey]: orderDirection,
      },
      skip: offset,
      take: limit,
    };

    const operations = await prismaClient.operation.findMany(prismaArgs).catch(
      createPrismaErrorParser({
        P2025: UserWithGivenIdNotFoundError.withMetadata({ userId: ownerId }),
      }),
    );

    const parsedOperations = operations.map((operation) =>
      mapOperation(operation, operationShape),
    );

    return parsedOperations;
  },

  async getOperationsByDate(ownerId, from, to) {
    const filterContainer = FilterContainer.empty<filters.GetOperation>();

    filterContainer.setRangeFilter(
      "createdAt",
      createFullDayRangeFilter(from, to),
    );

    return this.getOperations(ownerId, filterContainer);
  },

  async getOperationsSum(ownerId, from, to) {
    const dateFilter = mapRangeFilterToPrismaFilter(
      createFullDayRangeFilter(from, to),
    );

    const expenseSumQuery = prismaClient.operation.aggregate({
      _sum: { amount: true },
      where: {
        ownerId,
        type: "EXPENSE",
        createdAt: dateFilter,
      },
    });

    const incomeSumQuery = prismaClient.operation.aggregate({
      _sum: { amount: true },
      where: {
        ownerId,
        type: "INCOME",
        createdAt: dateFilter,
      },
    });

    const [expenseAggregation, incomeAggregation] =
      await prismaClient.$transaction([expenseSumQuery, incomeSumQuery]);

    /* eslint-disable no-underscore-dangle */
    const expenseSum = +(expenseAggregation._sum.amount ?? 0);
    const incomeSum = +(incomeAggregation._sum.amount ?? 0);
    /* eslint-enable no-underscore-dangle */
    const balance = incomeSum - expenseSum;

    return {
      expenseSum,
      incomeSum,
      balance,
    };
  },

  async getOperationById(operationId) {
    const operation = await prismaClient.operation
      .findFirstOrThrow({
        where: { id: operationId },
      })
      .catch(
        createPrismaErrorParser({
          P2025: InvalidOperationIdError.withMetadata({ operationId }),
        }),
      );

    return mapOperation(operation, PUBLIC_OPERATION_SHAPE);
  },

  async deleteOperation(operationId, requesterId) {
    const { count } = await prismaClient.operation.deleteMany({
      where: {
        id: operationId,
        ownerId: requesterId,
      },
    });

    if (count !== 1) {
      throw new CantDeleteOperationError({
        metadata: { operationId },
      });
    }

    return operationId;
  },

  async modifyOperation(operationId, userId, payload) {
    const newPayload: Prisma.OperationUpdateInput = { ...payload };

    if (payload.tags?.length) {
      const tags = await tagsService.assertUserTags(userId, payload.tags);
      newPayload.tags = {
        set: removeDuplicates([...tags, ...payload.tags]),
      };
    }

    const modifiedOperation = await prismaClient.operation.update({
      where: { id: operationId },
      data: newPayload,
    });

    return mapOperation(modifiedOperation, PUBLIC_OPERATION_SHAPE);
  },

  async getOperationsPeriodSummary(ownerId, filterContainer) {
    const periodGroup = filterContainer.getFilter("periodGroup");

    const query = Prisma.sql`
        SELECT
          o.type,
          SUM(o.amount) "amountSum",
          DATE_TRUNC(${periodGroup}, o."createdAt") date
        FROM
          "Operation" o
        WHERE
          o."ownerId"::text=${ownerId}
        GROUP BY
          DATE_TRUNC($1, o."createdAt"),
          o.type
        ORDER BY
          DATE_TRUNC($1, o."createdAt") DESC;
      `;

    const result = await prismaClient.$queryRaw(query);

    return result as any;
  },
};

export default operationService;
