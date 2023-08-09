import { schemas } from "@scrooge/shared";
import express, { Router } from "express";

import { wrapExpressErrorHandler } from "#root/api/errors/errors.utils.js";
import {
  createRequestBodyVerifier,
  createRequestParamsVerifier,
  createRequestQueryVerifier,
} from "#root/api/middleware/verifier.middleware.js";

import authController from "./controllers/auth/auth.controller.js";
import { sessionController } from "./controllers/session/session.controller.js";
import { haltAuthenticatedUsers } from "./guards/auth.guards.js";
import tokenMiddleware from "./middleware/token/token.middleware.js";

const authRouter: Router = express.Router();

authRouter.get(
  "/state",
  tokenMiddleware.safe,
  wrapExpressErrorHandler(authController.getAuthState),
);
authRouter.post(
  "/register/begin",
  tokenMiddleware.safe,
  haltAuthenticatedUsers,
  createRequestBodyVerifier({
    schema: schemas.auth.BeginRegistrationBodySchema,
  }),
  wrapExpressErrorHandler(authController.beginRegistration),
);
authRouter.post(
  "/register",
  tokenMiddleware.safe,
  haltAuthenticatedUsers,
  createRequestBodyVerifier({ schema: schemas.auth.RegisterUserBodySchema }),
  createRequestQueryVerifier({ schema: schemas.auth.RegisterUserQuerySchema }),
  wrapExpressErrorHandler(authController.register),
);
authRouter.post(
  "/login",
  tokenMiddleware.safe,
  haltAuthenticatedUsers,
  createRequestBodyVerifier({ schema: schemas.auth.LoginBodySchema }),
  wrapExpressErrorHandler(authController.logIn),
);
authRouter.post(
  "/logout",
  tokenMiddleware.safe,
  wrapExpressErrorHandler(authController.logOut),
);
authRouter.post(
  "/refresh",
  createRequestBodyVerifier({ schema: schemas.auth.RefreshBodySchema }),
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
  createRequestParamsVerifier({
    schema: schemas.session.InvalidateSessionParamsSchema,
  }),
  wrapExpressErrorHandler(sessionController.invalidateSession),
);
authRouter.patch(
  "/session",
  tokenMiddleware.strict,
  wrapExpressErrorHandler(sessionController.refreshSession),
);

export default authRouter;
