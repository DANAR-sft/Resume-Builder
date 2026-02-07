import type { Request, Response } from "express";
import { ResumeService } from "../services/resume-services";
import {
  patchMetaBody,
  patchProfileBody,
  patchExperienceBody,
  patchEducationBody,
  patchSkillsBody,
  patchExtrasBody,
} from "../validator/resume-validator";

const svc = new ResumeService();

function mustParamId(req: Request, key = "id"): string {
  const v: any = (req.params as any)?.[key];

  if (typeof v === "string" && v.length > 0) return v;
  if (Array.isArray(v) && typeof v[0] === "string" && v[0].length > 0) return v[0];

  throw new Error(`Missing or invalid param :${key}`);
}


export class ResumeController {
  // =========
  // Legacy API (resume terbaru)
  // =========
  list = async (req: Request, res: Response) => {
    const rows = await svc.list(req.accessToken!);
    res.json(rows);
  };

  create = async (req: Request, res: Response) => {
    const parsed = patchMetaBody.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.create(req.accessToken!, req.userId!, parsed.data);
    res.status(201).json(row);
  };

  // =========
  // By ID API (multi resume)
  // =========

  getById = async (req: Request, res: Response) => {
    const resumeId = mustParamId(req, "id");
    const row = await svc.getById(req.accessToken!, req.userId!, resumeId);
    res.json(row);
  };

  patchMetaById = async (req: Request, res: Response) => {
    const parsed = patchMetaBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const resumeId = mustParamId(req,"id")
    const row = await svc.patchMetaById(req.accessToken!, req.userId!, resumeId, parsed.data);
    res.json(row);
  };

  patchProfileById = async (req: Request, res: Response) => {
    const parsed = patchProfileBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const resumeId = mustParamId(req,"id")
    const row = await svc.patchSectionById(req.accessToken!, req.userId!, resumeId, {
      profile: parsed.data.profile,
    });
    res.json(row);
  };

  patchExperienceById = async (req: Request, res: Response) => {
    const parsed = patchExperienceBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const resumeId = mustParamId(req,"id")
    const row = await svc.patchSectionById(req.accessToken!, req.userId!, resumeId, {
      experience: parsed.data.experience,
    });
    res.json(row);
  };

  patchEducationById = async (req: Request, res: Response) => {
    const parsed = patchEducationBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const resumeId = mustParamId(req,"id")
    const row = await svc.patchSectionById(req.accessToken!, req.userId!, resumeId, {
      education: parsed.data.education,
    });
    res.json(row);
  };

  patchSkillsById = async (req: Request, res: Response) => {
    const parsed = patchSkillsBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const resumeId = mustParamId(req,"id")
    const row = await svc.patchSectionById(req.accessToken!, req.userId!, resumeId, {
      skills: parsed.data.skills,
    });
    res.json(row);
  };

  patchExtrasById = async (req: Request, res: Response) => {
    const parsed = patchExtrasBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const resumeId = mustParamId(req,"id")
    const row = await svc.patchSectionById(req.accessToken!, req.userId!, resumeId, {
      extras: parsed.data.extras,
    });
    res.json(row);
  };

    deleteById = async (req: Request, res: Response) => {
    const resumeId = mustParamId(req, "id"); // helper UUID/string aman
    await svc.deleteById(req.accessToken!, req.userId!, resumeId);
    res.status(204).json({message: "Delete resumes success!"});
  };


  duplicateById = async (req: Request, res: Response) => {
    const resumeId = mustParamId(req,"id")
    const row = await svc.duplicateById(req.accessToken!, req.userId!, resumeId);
    res.status(201).json(row);
  };
}
