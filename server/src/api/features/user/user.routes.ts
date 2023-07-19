import express from "express";

import tokenMiddleware from "#root/api/features/auth/middleware/token/token.middleware.js";
import { wrapExpressErrorHandler } from "#root/api/errors/errors.utils.js";
import userController from "./user.controller.js";

const userRouter = express.Router();

userRouter.get(
  "/info",
  tokenMiddleware.strict,
  wrapExpressErrorHandler(userController.getUserInfo),
);

export default userRouter;
