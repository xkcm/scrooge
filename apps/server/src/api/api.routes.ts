import express, { Router } from "express";

import authRouter from "#api:auth/auth.routes.js";
import metaRouter from "./features/meta/meta.routes.js";
import operationRouter from "./features/operation/operation.routes.js";
import tagsRouter from "./features/tags/tags.routes.js";
import userRouter from "./features/user/user.routes.js";

import { GLOBAL_ERROR_HANDLER } from "./errors/errors.utils.js";
import { ENDPOINT_NOT_FOUND_HANDLER } from "./utils/not-found-handler.util.js";

const apiRouter: Router = express.Router();
apiRouter.use(express.json());

apiRouter.use("/meta", metaRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/operation", operationRouter);
apiRouter.use("/tags", tagsRouter);
apiRouter.use("/user", userRouter);

apiRouter.use(ENDPOINT_NOT_FOUND_HANDLER);
apiRouter.use(GLOBAL_ERROR_HANDLER);

export default apiRouter;
