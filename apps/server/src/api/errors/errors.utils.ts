import { ApiError } from "@scrooge/shared";

import logger from "#core/logger/logger.js";
import {
  ApiHandler,
  ApiNextFunc,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";

export function wrapExpressErrorHandler(apiHandler: ApiHandler) {
  const wrappedApiHandler: ApiHandler = async (req, res, next) => (
    apiHandler(req, res, next).catch((error: Error) => next(error))
  );
  return wrappedApiHandler;
}

export const GLOBAL_ERROR_HANDLER = (
  (error: any, req: ApiRequest, res: ApiResponse, next: ApiNextFunc) => {
    const resolvedError: ApiError = (
      error instanceof ApiError ? error : new ApiError({ cause: error })
    );

    logger.debug(JSON.stringify(resolvedError), { error: resolvedError });

    res
      .status(resolvedError.metadata.httpCode || 500)
      .json({ error: resolvedError.toApiResponse() });

    next();
  }
);
