import type { Request, Response } from "express";
import { TemplateService } from "../services/template-services";

const svc = new TemplateService();

export class TemplateController {
    list = async (_req: Request, res: Response) => {
        res.json({
            availableTemplates: svc.listIds()
        });
    };
}
