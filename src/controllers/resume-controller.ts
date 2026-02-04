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
  // DAY 1
  get = async (req: Request, res: Response) => {
  const row = await svc.get(req.accessToken!, req.userId!);
  res.json(row);
  };

  // DAY 1 (optional)
  patchMeta = async (req: Request, res: Response) => {
    const parsed = patchMetaBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchMeta(req.accessToken!, req.userId!, parsed.data);
    res.json(row);
  };

  // DAY 1
  patchProfile = async (req: Request, res: Response) => {
    const parsed = patchProfileBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { profile: parsed.data.profile });
    res.json(row);
  };

  // DAY 2
  patchExperience = async (req: Request, res: Response) => {
    const parsed = patchExperienceBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { experience: parsed.data.experience });
    res.json(row);
  };

  // DAY 2
  patchEducation = async (req: Request, res: Response) => {
    const parsed = patchEducationBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { education: parsed.data.education });
    res.json(row);
  };

  // DAY 3
  patchSkills = async (req: Request, res: Response) => {
    const parsed = patchSkillsBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { skills: parsed.data.skills });
    res.json(row);
  };

  // DAY 3
  patchExtras = async (req: Request, res: Response) => {
    const parsed = patchExtrasBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const row = await svc.patchSection(req.accessToken!, req.userId!, { extras: parsed.data.extras });
    res.json(row);
  };
}
