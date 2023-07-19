import { Prisma } from "@prisma/client";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
import { removeDuplicates } from "#core/utils/index.js";

import prismaClient from "#core/prisma/prisma.js";
import { UserWithGivenIdNotFoundError } from "#root/api/features/auth/services/user/user.service.errors.js";
import tagsService from "#root/api/features/tags/services/tags/tags.service.js";
import {
  CantDeleteOperationError,
  InvalidOperationIdError,
} from "../operation.errors.js";

import { OperationService } from "./operation.service.types.js";
import { createFullDayDatePrismaFilter, mapToPublicOperation } from "./operation.service.utils.js";

const PUBLIC_OPERATION_SELECT = {
  id: true,
  createdAt: true,
  amount: true,
  tags: true,
  description: true,
  type: true,
};

const operationService: OperationService = {
  async addOperation(ownerId, type, payload) {
    if (payload.tags) {
      await tagsService.assertUserTags(ownerId, payload.tags);
    }

    const createdOperation = await prismaClient.operation.create({
      data: {
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
      select: PUBLIC_OPERATION_SELECT,
    }).catch(createPrismaErrorParser({
      P2025: UserWithGivenIdNotFoundError.withMetadata({ userId: ownerId }),
    }));

    return mapToPublicOperation(createdOperation);
  },

  async getAllOperations(ownerId, filters = {}) {
    const operations = await prismaClient.operation.findMany({
      where: {
        ...filters,
        ownerId,
      },
      select: PUBLIC_OPERATION_SELECT,
    }).catch(createPrismaErrorParser({
      P2025: UserWithGivenIdNotFoundError.withMetadata({ userId: ownerId }),
    }));

    const parsedOperations = operations.map((operation) => mapToPublicOperation(operation));

    return parsedOperations;
  },

  async getOperationsByDate(ownerId, from, to) {
    const filters: Parameters<OperationService["getAllOperations"]>[1] = {
      createdAt: createFullDayDatePrismaFilter(from, to),
    };

    return this.getAllOperations(ownerId, filters);
  },

  async getOperationsSum(ownerId, from, to) {
    const dateFilter = createFullDayDatePrismaFilter(from, to);
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

    const [
      expenseAggregation,
      incomeAggregation,
    ] = await prismaClient.$transaction([expenseSumQuery, incomeSumQuery]);

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
    const operation = await prismaClient.operation.findFirstOrThrow({
      where: { id: operationId },
    }).catch(createPrismaErrorParser({
      P2025: InvalidOperationIdError.withMetadata({ operationId }),
    }));

    return mapToPublicOperation(operation);
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

    return mapToPublicOperation(modifiedOperation);
  },
};

export default operationService;
