import { schemas } from "@scrooge/shared";
import express, { Router } from "express";

import { wrapExpressErrorHandler } from "#root/api/errors/errors.utils.js";
import tokenMiddleware from "#root/api/features/auth/middleware/token/token.middleware.js";
import {
  createRequestBodyVerifier,
  createRequestQueryVerifier,
} from "#root/api/middleware/verifier.middleware.js";

import tagsController from "./tags.controller.js";

const tagsRouter: Router = express.Router();

tagsRouter.get(
  "/",
  tokenMiddleware.strict,
  wrapExpressErrorHandler(tagsController.getTags),
);
tagsRouter.post(
  "/",
  tokenMiddleware.strict,
  createRequestBodyVerifier({ schema: schemas.tags.AddTagBodySchema }),
  wrapExpressErrorHandler(tagsController.addTag),
);
tagsRouter.delete(
  "/",
  tokenMiddleware.strict,
  createRequestQueryVerifier({ schema: schemas.tags.DeleteTagQuerySchema }),
  wrapExpressErrorHandler(tagsController.deleteTag),
);
tagsRouter.put(
  "/",
  tokenMiddleware.strict,
  createRequestBodyVerifier({ schema: schemas.tags.ModifyTagBodySchema }),
  createRequestQueryVerifier({ schema: schemas.tags.ModifyTagQuerySchema }),
  wrapExpressErrorHandler(tagsController.modifyTag),
);

export default tagsRouter;
