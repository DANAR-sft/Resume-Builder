import express from "express"
import { auth } from "../middleware/auth";
import { ResumeController } from "../controllers/resume-controller";

const c = new ResumeController();
export const router = express.Router();

router.get("/resumes", auth, c.list);
router.post("/resumes", auth, c.create);

router.get("/resume", auth, c.get);
router.patch("/resume/meta", auth, c.patchMeta);

router.patch("/resume/sections/profile", auth, c.patchProfile);
router.patch("/resume/sections/experience", auth, c.patchExperience);
router.patch("/resume/sections/education", auth, c.patchEducation);
router.patch("/resume/sections/skills", auth, c.patchSkills);
router.patch("/resume/sections/extras", auth, c.patchExtras);
