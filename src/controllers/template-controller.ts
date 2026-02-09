import type { Request, Response } from "express";
import { TemplateService } from "../services/template-services";

const svc = new TemplateService();

export class TemplateController {
    list = async (_req: Request, res: Response) => {
        // Mengembalikan daftar ID saja, karena styling (font/warna) 
        // sudah diurus sendiri oleh FE dan disimpan ke kolom JSON data.
        res.json({
            availableTemplates: svc.listIds()
        });
    };
}
