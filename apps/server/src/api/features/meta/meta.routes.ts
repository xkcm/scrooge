import express from "express";
import metaController from "./meta.controller.js";

const metaRouter = express.Router();

metaRouter.get("/config", metaController.getServerConfig);

export default metaRouter;
