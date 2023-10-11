import { ApiError, ApiErrorAttachment } from "@scrooge/shared";
import { BetterError } from "@xkcm/better-errors";

import { Constructor } from "#core/utils/utils.types.js";

import { UnknownPrismaError } from "./prisma.errors.js";

export function parsePrismaError<
  T extends Constructor<BetterError, ConstructorParameters<typeof BetterError>>,
>(error: any, errorCodeMap: Record<string, T>) {
  if (error instanceof ApiError) {
    return error;
  }

  const ErrorClass =
    errorCodeMap[error.code || error.errorCode] ??
    errorCodeMap?.default ??
    UnknownPrismaError;

  if (!(ErrorClass.prototype instanceof ApiError)) {
    return new ErrorClass({ cause: error });
  }

  const prismaErrorAttachment: ApiErrorAttachment = {
    name: "prismaError",
    type: "debug",
    data: {
      prismaErrorMessage: error.message,
      prismaErrorCode: error.code,
    },
  };

  return new ErrorClass({
    cause: error,
    metadata: {
      attachments: [prismaErrorAttachment],
    },
  });
}

export function createPrismaErrorParser<T extends Constructor<BetterError>>(
  errorCodeMap: Record<string, T> = {},
) {
  return (error: any) => {
    throw parsePrismaError(error, errorCodeMap);
  };
}
