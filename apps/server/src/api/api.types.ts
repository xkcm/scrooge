import express from "express";

export type ApiRequest<
  RequestBody = any,
  Params = any,
  Query = any,
> = express.Request<Params, any, RequestBody, Query>;
export type ApiResponse<
  ResponseBody = any,
  Locals extends Record<string, any> = any,
> = express.Response<ResponseBody, Locals>;
export type ApiNextFunc = express.NextFunction;

export type ApiHandler<
  RequestBody = any,
  Params = any,
  Locals extends Record<string, any> = any,
> = (
  req: ApiRequest<RequestBody, Params>,
  res: ApiResponse<Locals>,
  next: ApiNextFunc,
) => any | Promise<any>;

export type ApiErrorHandler<
  RequestBody = any,
  Params = any,
  Locals extends Record<string, any> = any,
  Error = any,
> = (
  req: ApiRequest<RequestBody, Params>,
  res: ApiResponse<Locals>,
  next: ApiNextFunc,
  error: Error,
) => any | Promise<any>;

export type ApiControllerObject = Record<string, ApiHandler>;

export interface SafeApiMiddleware {
  safe: ApiHandler;
  strict: ApiHandler;
}
