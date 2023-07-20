import { BetterError, withCode, withMessage } from "@xkcm/better-errors";

@withCode("core.prisma.prisma_client_not_initialized")
@withMessage(
  "Prisma Client has not been initialized, use .initialize() method to create Prisma Client",
)
export class PrismaClientNotInitializedError extends BetterError {}

@withCode("core.prisma.unknown_prisma_error")
@withMessage("Unknown Prisma error occurred")
export class UnknownPrismaError extends BetterError {}
