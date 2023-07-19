import { ApiErrorHandler, ApiHandler, SafeApiMiddleware } from "#root/api/api.types.js";

type WrapMiddlewareWithSafeVariantOptions = {
  strictHandler: ApiHandler;
  errorCallback?: ApiErrorHandler;
};

export const wrapMiddlewareWithSafeVariant = (
  options: WrapMiddlewareWithSafeVariantOptions,
): SafeApiMiddleware => {
  const {
    strictHandler,
    errorCallback,
  } = options;

  const safeHandler: ApiHandler = async (req, res, next) => {
    const mockedNext = (possibleError?: any) => {
      if (possibleError && possibleError instanceof Error) {
        errorCallback?.(req, res, next, possibleError);
        next();
      } else {
        next(possibleError);
      }
    };

    await strictHandler(req, res, mockedNext);
  };

  return {
    strict: strictHandler,
    safe: safeHandler,
  };
};
