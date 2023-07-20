import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { Constructor } from "#core/utils/utils.types.js";
import { ApiError, ApiErrorAttachment } from "@scrooge/shared";

import { BetterError } from "@xkcm/better-errors";
import { UnknownPrismaError } from "./prisma.errors.js";

export function parsePrismaError<
  T extends Constructor<BetterError, ConstructorParameters<typeof BetterError>>>(
  error: any,
  errorCodeMap: Record<string, T>,
) {
  let ErrorClass;
  if (error instanceof PrismaClientKnownRequestError && errorCodeMap[error.code]) {
    ErrorClass = errorCodeMap[error.code];
  } else {
    ErrorClass = errorCodeMap?.default || UnknownPrismaError;
  }

  console.info(ErrorClass)

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
