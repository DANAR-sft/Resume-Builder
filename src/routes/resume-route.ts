import express from "express";
import { auth } from "../middleware/auth";
import { ResumeController } from "../controllers/resume-controller";

const c = new ResumeController();
export const router = express.Router();

router.get("/resumes", auth, c.list);
router.post("/resumes", auth, c.create);

router.get("/resumes/:id", auth, c.getById);
router.patch("/resumes/:id/meta", auth, c.patchMetaById);

router.patch("/resumes/:id/sections/profile", auth, c.patchProfileById);
router.patch("/resumes/:id/sections/experience", auth, c.patchExperienceById);
router.patch("/resumes/:id/sections/education", auth, c.patchEducationById);
router.patch("/resumes/:id/sections/skills", auth, c.patchSkillsById);
router.patch("/resumes/:id/sections/extras", auth, c.patchExtrasById);
router.delete("/resumes/:id", auth, c.deleteById);

router.post("/resumes/:id/duplicate", auth, c.duplicateById);
