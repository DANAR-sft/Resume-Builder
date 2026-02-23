// ===== Enums / Union Types =====
export type TemplateId = "ats-1" | "executive-1" | "modern-tech-1";

export type LinkType =
  | "linkedin"
  | "github"
  | "portfolio"
  | "website"
  | "behance"
  | "dribbble"
  | "medium"
  | "kaggle"
  | "stackoverflow"
  | "twitter"
  | "instagram"
  | "youtube"
  | "other";

export type SectionKey =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "extras";

// ===== Core Resume =====
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeData {
  profile?: ProfileSection;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: string[];
  extras?: ExtrasSection;
  theme?: ThemeConfig;
  sectionOrder?: SectionKey[];
}

// ===== Profile =====
export interface ProfileLink {
  type?: LinkType;
  label?: string;
  url: string;
}

export interface ProfileSection {
  fullName: string;
  headline?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  links?: ProfileLink[];
}

// ===== Experience =====
export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  employment_type: string;
  start: string;
  end?: string;
  location?: string;
  highlights?: string[];
}

// ===== Education =====
export interface EducationItem {
  id?: string;
  college: string;
  degree?: string;
  field?: string;
  start: string;
  end?: string;
  gpa?: string;
}

// ===== Extras =====
export interface CertificationItem {
  name: string;
  issuer?: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  name: string;
  level?: string;
}

export interface ProjectItem {
  name: string;
  description?: string;
  url?: string;
}

export interface ExtrasSection {
  certifications?: CertificationItem[];
  languages?: LanguageItem[];
  projects?: ProjectItem[];
  [key: string]: any;
}

// ===== Theme =====
export interface ThemeConfig {
  fontFamily?: string;
  fontSize?: string;
  pagePadding?: string;
}

// ===== Request Bodies (match backend patch* schemas) =====
export interface CreateResumeRequest {
  title?: string;
  templateId?: TemplateId;
}

export interface UpdateMetaRequest {
  title?: string;
  templateId?: TemplateId;
}

export interface UpdateProfileRequest {
  profile: ProfileSection;
}

export interface UpdateExperienceRequest {
  experience: ExperienceItem[];
}

export interface UpdateEducationRequest {
  education: EducationItem[];
}

export interface UpdateSkillsRequest {
  skills: string[];
}

export interface UpdateExtrasRequest {
  extras: ExtrasSection;
}

export interface UpdateThemeRequest {
  theme: ThemeConfig;
}

export interface UpdateSectionOrderRequest {
  sectionOrder: SectionKey[];
}
