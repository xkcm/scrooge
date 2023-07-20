import express, { Router } from "express";

import { wrapExpressErrorHandler } from "#root/api/errors/errors.utils.js";
import tokenMiddleware from "#root/api/features/auth/middleware/token/token.middleware.js";
import {
  createRequestBodyVerifier,
  createRequestQueryVerifier,
} from "#root/api/middleware/verifier.middleware.js";

import tagsController from "./tags.controller.js";
import {
  AddTagSchema,
  DeleteTagSchema,
  ModifyTagSchema,
} from "./tags.schemas.js";

const tagsRouter: Router = express.Router();

tagsRouter.get(
  "/",
  tokenMiddleware.strict,
  wrapExpressErrorHandler(tagsController.getTags),
);
tagsRouter.post(
  "/",
  tokenMiddleware.strict,
  createRequestBodyVerifier({ schema: AddTagSchema }),
  wrapExpressErrorHandler(tagsController.addTag),
);
tagsRouter.delete(
  "/",
  tokenMiddleware.strict,
  createRequestQueryVerifier({ schema: DeleteTagSchema }),
  wrapExpressErrorHandler(tagsController.deleteTag),
);
tagsRouter.put(
  "/",
  tokenMiddleware.strict,
  createRequestBodyVerifier({ schema: ModifyTagSchema.BODY }),
  createRequestQueryVerifier({ schema: ModifyTagSchema.QUERY }),
  wrapExpressErrorHandler(tagsController.modifyTag),
);

export default tagsRouter;
