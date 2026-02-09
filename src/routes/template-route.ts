import express from "express";
import { TemplateController } from "../controllers/template-controller";
import { auth } from "../middleware/auth";

const c = new TemplateController();
export const templateRouter = express.Router();

// biasanya public (tanpa auth)
templateRouter.get("/templates",auth ,c.list);
