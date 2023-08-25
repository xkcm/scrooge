import { Operation, Prisma } from "@prisma/client";
import { FilterContainer, filters, schemas } from "@scrooge/shared";
import { Memento, MementoController, RedisStorage } from "@xkcm/memento";

import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
import redisClient from "#core/redis/redis.js";
import { UserWithGivenIdNotFoundError } from "#root/api/features/auth/services/user/user.service.errors.js";
import tagsService from "#root/api/features/tags/services/tags/tags.service.js";
import { removeDuplicates } from "#root/core/utils/utils.js";

import { PUBLIC_OPERATION_SHAPE } from "../operation.consts.js";
import {
  CantDeleteOperationError,
  InvalidOperationIdError,
} from "../operation.errors.js";
import {
  OperationService,
  RawSummaryRecord,
} from "./operation.service.types.js";
import {
  createFullDayRangeFilter,
  mapOperation,
  mapRangeFilterToPrismaFilter,
} from "./operation.service.utils.js";

const operationMementoController = new MementoController();
const operationMemento = new Memento({
  ttl: -1,
  storage: new RedisStorage(redisClient),
  controller: operationMementoController,
});

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
          createdAt: payload.createdAt,
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

    await operationMementoController.invalidateAll();
    return mapOperation(createdOperation, PUBLIC_OPERATION_SHAPE);
  },

  getOperations: operationMemento.memoize(
    async (
      ownerId: Operation["id"],
      filterContainer: FilterContainer<filters.GetOperation>,
      operationShape = PUBLIC_OPERATION_SHAPE,
    ) => {
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
      const orderDirection = filterContainer.getFilter(
        "orderDirection",
        "desc",
      );

      const prismaArgs: Prisma.OperationFindManyArgs = {
        where,
        select: operationShape,
        orderBy: {
          [orderKey]: orderDirection,
        },
        skip: offset,
        take: limit,
      };

      const operations = await prismaClient.operation
        .findMany(prismaArgs)
        .catch(
          createPrismaErrorParser({
            P2025: UserWithGivenIdNotFoundError.withMetadata({
              userId: ownerId,
            }),
          }),
        );

      const parsedOperations = operations.map((operation) =>
        mapOperation(operation, operationShape),
      );

      return parsedOperations;
    },
  ),

  getOperationsByDate: operationMemento.memoize(async (ownerId, from, to) => {
    const filterContainer = FilterContainer.empty<filters.GetOperation>();

    filterContainer.setRangeFilter(
      "createdAt",
      createFullDayRangeFilter(from, to),
    );

    return operationService.getOperations(ownerId, filterContainer);
  }),

  getOperationsSum: operationMemento.memoize(async (ownerId, from, to) => {
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
  }),

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

    await operationMementoController.invalidateAll();
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

    await operationMementoController.invalidateAll();
    return mapOperation(modifiedOperation, PUBLIC_OPERATION_SHAPE);
  },

  getOperationsPeriodSummary: operationMemento.memoize(
    async (ownerId, filterContainer) => {
      console.info({ hello: "World" });
      const period = filterContainer.getFilter("periodGroup");
      const from = new Date(filterContainer.getFilter("from"));
      const to = new Date(filterContainer.getFilter("to", Date.now()));
      const timezoneInMinutes = filterContainer.getFilter("timezone");
      const timezone = `${timezoneInMinutes < 0 ? "+" : "-"}${Math.abs(
        timezoneInMinutes / 60,
      )}`;

      const query = Prisma.sql`
        WITH
          date_range AS (
            SELECT
              date_trunc(${period}, generate_series(${from}, ${to}, ${`1 ${period}`}::interval)) AS "date",
              'EXPENSE'::"OperationType" AS "type"
            UNION ALL
            SELECT
              date_trunc(${period}, generate_series(${from}, ${to}, ${`1 ${period}`}::interval)) AS "date",
              'INCOME'::"OperationType" AS "type"
            ORDER BY "date", "type" DESC
          ),
          operations AS (
            SELECT
              o."type",
              o."amount",
              date_trunc(${period}, o."createdAt" AT TIME ZONE ${timezone}) AS "date"
            FROM "Operation" o
            WHERE o."ownerId"::text = ${ownerId}
          )
        SELECT
          date_range."date" as range_date,
          sum(coalesce(operations."amount", 0::money)) AS operations_sum,
          date_range."type" AS range_type
        FROM date_range
        LEFT OUTER JOIN operations
        ON operations."date" = date_range."date" AND operations."type" = date_range."type"
        GROUP BY "range_date", "range_type"
        ORDER BY "range_date" DESC
      `;

      const records = await prismaClient.$queryRaw<RawSummaryRecord[]>(query);
      const mappedRecords = records.map((summaryEntry) => ({
        date: new Date(summaryEntry.range_date).getTime(),
        sum: +summaryEntry.operations_sum,
        type: summaryEntry.range_type,
      }));

      const result =
        mappedRecords.reduce<schemas.operation.GetOperationsPeriodSummaryResponse>(
          (acc, cur) => {
            const entry = {
              date: cur.date,
              sum: cur.sum,
            };
            const key = cur.type.toLowerCase() as "income" | "expense";
            return {
              ...acc,
              [key]: {
                sum: acc[key].sum + cur.sum,
                entries: acc[key].entries.concat(entry),
              },
            };
          },
          {
            income: { sum: 0, entries: [] },
            expense: { sum: 0, entries: [] },
            from: from.getTime(),
            to: from.getTime(),
            periodGroup: period,
          },
        );

      return result;
    },
  ),
};

export default operationService;
