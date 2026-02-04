import type { Request, Response } from "express";
import { ResumeService } from "../services/resume-services";
import {
  patchMetaBody,
  patchProfileBody,
  patchExperienceBody,
  patchEducationBody,
  patchSkillsBody,
  patchExtrasBody
} from "../validator/resume-validator";

const svc = new ResumeService();

export class ResumeController {

  get = async (req: Request, res: Response) => {
    const row = await svc.get(req.accessToken!);
    res.json(row);
  };

  // BARU: list semua resume user
  list = async (req: Request, res: Response) => {
    const rows = await svc.list(req.accessToken!);
    res.json(rows);
  };

  // BARU: create resume baru
  create = async (req: Request, res: Response) => {
    const parsed = patchMetaBody.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.create(req.accessToken!, req.userId!, parsed.data);
    res.status(201).json(row);
  };


  patchMeta = async (req: Request, res: Response) => {
    const parsed = patchMetaBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchMeta(req.accessToken!, req.userId!, parsed.data);
    res.json(row);
  };

  patchProfile = async (req: Request, res: Response) => {
    const parsed = patchProfileBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { profile: parsed.data.profile });
    res.json(row);
  };


  patchExperience = async (req: Request, res: Response) => {
    const parsed = patchExperienceBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { experience: parsed.data.experience });
    res.json(row);
  };

  patchEducation = async (req: Request, res: Response) => {
    const parsed = patchEducationBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { education: parsed.data.education });
    res.json(row);
  };

  patchSkills = async (req: Request, res: Response) => {
    const parsed = patchSkillsBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { skills: parsed.data.skills });
    res.json(row);
  };


  patchExtras = async (req: Request, res: Response) => {
    const parsed = patchExtrasBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { extras: parsed.data.extras });
    res.json(row);
  };
}
