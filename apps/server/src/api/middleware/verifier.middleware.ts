import { ZodSchema } from "zod";

import { ApiError } from "@scrooge/shared";
import {
  ApiNextFunc,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";
import {
  InvalidRequestBodyError,
  InvalidRequestCookiesError,
  InvalidRequestParamsError,
  InvalidRequestQueryError,
} from "#root/api/errors/request.errors.js";

type GenericVerifierOptions = {
  schema: ZodSchema;
  assign?: boolean;
  allowEmptyObject?: boolean;
};
type VerifierFactoryGeneratorOptions = {
  requestProperty: Extract<keyof ApiRequest, "body" | "cookies" | "params" | "query">,
  errorClass: { new (...args: ConstructorParameters<typeof ApiError>): ApiError },
};

const generateGenericRequestVerifierFactory = (
  <T extends GenericVerifierOptions = GenericVerifierOptions>(
    generatorOptions: VerifierFactoryGeneratorOptions,
  ) => (
    (options: T) => (req: ApiRequest, res: ApiResponse, next: ApiNextFunc) => {
      let rawData = req[generatorOptions.requestProperty];
      if (options.allowEmptyObject && Object.keys(rawData).length === 0) {
        rawData = undefined;
      }

      const parsed = options.schema.safeParse(rawData);
      if (!parsed.success) {
        const ErrorClass = generatorOptions.errorClass;
        return next(new ErrorClass({
          metadata: {
            attachments: [{
              name: `invalid_${generatorOptions.requestProperty}`,
              type: "public",
              data: parsed.error,
            }],
          },
          cause: parsed.error,
        }));
      }

      if (options.assign ?? true) {
        req[generatorOptions.requestProperty] = parsed.data;
      }
      return next();
    }
  )
);

export const createRequestBodyVerifier = generateGenericRequestVerifierFactory({
  errorClass: InvalidRequestBodyError,
  requestProperty: "body",
});

export const createRequestParamsVerifier = generateGenericRequestVerifierFactory({
  errorClass: InvalidRequestParamsError,
  requestProperty: "params",
});

export const createRequestCookiesVerifier = generateGenericRequestVerifierFactory({
  errorClass: InvalidRequestCookiesError,
  requestProperty: "cookies",
});

export const createRequestQueryVerifier = generateGenericRequestVerifierFactory({
  errorClass: InvalidRequestQueryError,
  requestProperty: "query",
});
