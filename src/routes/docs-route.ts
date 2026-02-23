import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";

const router = Router();

const filePath = path.join(process.cwd(), "src/docs/openapi.yaml");
const file = fs.readFileSync(filePath, "utf8");
const swaggerDocument = YAML.parse(file);
const baseUrl =
  process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

swaggerDocument.servers = [{ url: baseUrl }];

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true, // ✅ token tidak hilang saat refresh
    },
  })
);

export default router;