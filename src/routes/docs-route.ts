import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";

const router = Router();

const filePath = path.join(process.cwd(), "src/docs/openapi.yaml");
const file = fs.readFileSync(filePath, "utf8");
const swaggerDocument = YAML.parse(file);

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

export default router;
