import express, { Router } from "express";
import metaController from "./meta.controller.js";

const metaRouter: Router = express.Router();

metaRouter.get("/config", metaController.getServerConfig);

export default metaRouter;
