import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "../middleware/error";
import { router } from "../routes/resume-route";
import { accountRoutes } from "../routes/account-route";
import { authRoutes } from "../routes/auth-route";
import {templateRouter} from "../routes/template-route"

export const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/v1", accountRoutes);
app.use("/api/v1", router);
app.use("/api/v1", authRoutes);
app.use("/api/v1", templateRouter)

app.use(errorHandler);
