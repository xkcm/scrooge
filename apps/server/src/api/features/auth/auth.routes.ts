import express from "express";

import { createRequestBodyVerifier, createRequestParamsVerifier, createRequestQueryVerifier } from "#root/api/middleware/verifier.middleware.js";
import { wrapExpressErrorHandler } from "#root/api/errors/errors.utils.js";

import {
  BeginRegistrationSchema,
  InvalidateSessionSchema,
  LoginSchema,
  RefreshSchema,
  RegisterUserSchema,
} from "./auth.schemas.js";

import authController from "./controllers/auth/auth.controller.js";
import { sessionController } from "./controllers/session/session.controller.js";
import { haltAuthenticatedUsers } from "./guards/auth.guards.js";
import tokenMiddleware from "./middleware/token/token.middleware.js";

const authRouter = express.Router();

authRouter.get(
  "/state",
  tokenMiddleware.safe,
  wrapExpressErrorHandler(authController.getAuthState),
);
authRouter.post(
  "/register/begin",
  tokenMiddleware.safe,
  haltAuthenticatedUsers,
  createRequestBodyVerifier({ schema: BeginRegistrationSchema }),
  wrapExpressErrorHandler(authController.beginRegistration),
);
authRouter.post(
  "/register",
  tokenMiddleware.safe,
  haltAuthenticatedUsers,
  createRequestBodyVerifier({ schema: RegisterUserSchema.BODY }),
  createRequestQueryVerifier({ schema: RegisterUserSchema.QUERY }),
  wrapExpressErrorHandler(authController.register),
);
authRouter.post(
  "/login",
  tokenMiddleware.safe,
  haltAuthenticatedUsers,
  createRequestBodyVerifier({ schema: LoginSchema }),
  wrapExpressErrorHandler(authController.login),
);
authRouter.post(
  "/refresh",
  createRequestBodyVerifier({ schema: RefreshSchema }),
  wrapExpressErrorHandler(authController.refresh),
);

authRouter.get(
  "/sessions",
  tokenMiddleware.strict,
  wrapExpressErrorHandler(sessionController.getSessions),
);
authRouter.delete(
  "/session/:sessionId",
  tokenMiddleware.strict,
  createRequestParamsVerifier({ schema: InvalidateSessionSchema }),
  wrapExpressErrorHandler(sessionController.invalidateSession),
);
authRouter.patch(
  "/session",
  tokenMiddleware.strict,
  wrapExpressErrorHandler(sessionController.refreshSession),
);

export default authRouter;
