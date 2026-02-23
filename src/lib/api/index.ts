/**
 * Central export for all API clients
 */

export { resumeApi } from "./resume-api";
export { templateApi } from "./template-api";
export { authApi } from "./auth-api";
export { default as apiClient } from "./api-client";

// Re-export types
export type {
  Resume,
  ResumeData,
  ProfileSection,
  ProfileLink,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  LanguageItem,
  ProjectItem,
  ExtrasSection,
  ThemeConfig,
  TemplateId,
  SectionKey,
  LinkType,
} from "@/types/resume";
export type { Template } from "./template-api";
