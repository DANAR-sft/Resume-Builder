import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "../middleware/error";
import { router } from "../routes/resume-route";
import { accountRoutes } from "../routes/account-route";
import { authRoutes } from "../routes/auth-route";
import { templateRouter } from "../routes/template-route";
import docsRoute from "../routes/docs-route";


export const app = express();

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// preflight handler TANPA route pattern (anti path-to-regexp error)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // cors middleware udah set header, tinggal balikin 204
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/v1", accountRoutes);
app.use("/api/v1", router);
app.use("/api/v1", authRoutes);
app.use("/api/v1", templateRouter);
app.use("/api/docs", docsRoute);


app.use(errorHandler);
