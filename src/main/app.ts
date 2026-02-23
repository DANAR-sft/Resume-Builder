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

const allowedOrigins = process.env.FRONTEND_URL! || "http://localhost:3000";


const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
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
