import express from "express";
import { auth } from "../middleware/auth";
import { AccountController } from "../controllers/account-controller";

const c = new AccountController();

export const accountRoutes = express.Router();

accountRoutes.get("/account", auth, c.get);
accountRoutes.patch("/account/display-name", auth, c.patchDisplayName);
