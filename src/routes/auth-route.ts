import { Router } from "express";
import { auth } from "../middleware/auth";
import { AuthController } from "../controllers/auth-controller";

const c = new AuthController();
export const authRoutes = Router();

authRoutes.post("/auth/logout", auth, c.logout);
