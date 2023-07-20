import {
  ApiHandler,
  ApiResponse,
} from "#root/api/api.types.js";
import { AuthLocals } from "#root/api/features/auth/middleware/token/token.middleware.types.js";

import {
  AnonymousUsersNotAllowedError,
  AuthenticatedUsersNotAllowedError,
  TokenMiddlewareRequiredError,
} from "./auth.guards.errors.js";

export const haltAuthenticatedUsers: ApiHandler = (
  req,
  res: ApiResponse<AuthLocals>,
  next,
) => {
  if (!Reflect.has(res.locals, "auth")) {
    throw new TokenMiddlewareRequiredError();
  }

  if (res.locals.auth.isAuthenticated) {
    return next(new AuthenticatedUsersNotAllowedError());
  }
  return next();
};

export const haltAnonymousUsers: ApiHandler = (
  req,
  res: ApiResponse<AuthLocals>,
  next,
) => {
  if (!Reflect.has(res.locals, "auth")) {
    throw new TokenMiddlewareRequiredError();
  }

  if (!res.locals.auth.isAuthenticated) {
    return next(new AnonymousUsersNotAllowedError());
  }
  return next;
};
