import { z } from "zod";

// trimmed function custom
const trimmed = (max: number) =>
  z.string().trim().min(1, "Required").max(max, `Max ${max} chars`);

// optional trimmed custom
const optionalTrimmed = (max: number) =>
  z.string().trim().max(max, `Max ${max} chars`).optional();

const urlSchema = z.string().trim().url("Invalid URL");

// ===== Templates (ADD) =====
export const TemplateIdSchema = z.enum(["ats-1", "minimalist-1", "executive-1","modern tech-1"]);

// ===== Theme (ADD) =====
export const themeSchema = z.object({
  primaryColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
  fontFamily: z.string().trim().min(1),
  fontSize: z.string().trim().default("11px"),
  pagePadding: z.string().trim().default("10mm"),
}).refine((data) => {
  // Opsi tambahan: Kamu bisa memvalidasi apakah font/warna tersebut 
  // benar-benar didukung oleh templateId yang dipilih user.
  // Tapi untuk tahap awal, validator string biasa sudah cukup.
  return true;
});

// ===== Section order (ADD) =====
export const sectionKeySchema = z.enum([
  "profile",
  "experience",
  "education",
  "skills",
  "extras",
]);
export const sectionOrderSchema = z.array(sectionKeySchema).min(1);

// ===== Existing schemas =====
export const linkTypeSchema = z.enum([
  "linkedin",
  "github",
  "portfolio",
  "website",
  "behance",
  "dribbble",
  "medium",
  "kaggle",
  "stackoverflow",
  "twitter",
  "instagram",
  "youtube",
  "other",
]);

export const profileLinkSchema = z.object({
  type: linkTypeSchema.default("other"),
  label: optionalTrimmed(30),
  url: urlSchema,
});

/**
 * Profile (final)
 */
export const profileSchema = z
  .object({
    fullName: trimmed(80),
    headline: optionalTrimmed(120),

    avatarUrl: urlSchema.optional(),

    email: z.string().trim().email("Invalid email").optional(),
    phone: optionalTrimmed(30),
    location: optionalTrimmed(80),

    summary: z.string().trim().max(1200, "Max 1200 chars").optional(),

    links: z.array(profileLinkSchema).max(12, "Max 12 links").optional(),
  })
  .superRefine((val, ctx) => {
    // avoid base64 data URL
    if (val.avatarUrl?.startsWith("data:")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["avatarUrl"],
        message: "Use uploaded URL (Storage), not base64 data URL",
      });
    }

    // no duplicate URLs
    if (val.links?.length) {
      const seen = new Set<string>();
      for (let i = 0; i < val.links.length; i++) {
        const u = val.links[i]?.url?.toLowerCase();
        if (!u) continue;
        if (seen.has(u)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["links", i, "url"],
            message: "Duplicate URL",
          });
        }
        seen.add(u);
      }
    }
  });

/**
 * DAY 2 schemas
 */
export const experienceItemSchema = z.object({
  id: z.string().optional(),
  company: trimmed(80),
  role: trimmed(80),
  employment_type: z.string(),
  start: z.coerce.date().transform((val) => val.toISOString().split("T")[0]),
  end: z.coerce.date().optional().or(z.literal("")),
  location: optionalTrimmed(80),
  highlights: z.array(z.string().trim().min(1)).max(12).optional(),
});

export const educationItemSchema = z.object({
  id: z.string().optional(),
  college: trimmed(120),
  degree: optionalTrimmed(80),
  field: optionalTrimmed(80),
  start: z.coerce.date().transform((val) => val.toISOString().split("T")[0]),
  end: z.coerce.date().optional().or(z.literal("")),
  gpa: optionalTrimmed(20),
});

/**
 * DAY 3 schemas
 */
export const skillsSchema = z.array(z.string().trim().min(1)).max(100);

export const extrasSchema = z
  .object({
    certifications: z
      .array(
        z.object({
          name: trimmed(120),
          issuer: optionalTrimmed(80),
          date: z.coerce.date().transform((val) => val.toISOString().split("T")[0]),
          url: urlSchema.optional(),
        })
      )
      .max(50)
      .optional(),
    languages: z
      .array(
        z.object({
          name: trimmed(60),
          level: optionalTrimmed(30),
        })
      )
      .max(30)
      .optional(),
    projects: z
      .array(
        z.object({
          name: trimmed(120),
          description: z.string().trim().max(800).optional(),
          url: urlSchema.optional(),
        })
      )
      .max(50)
      .optional(),
  })
  .passthrough();

/**
 * Meta (optional DAY 1)
 * templateId sekarang divalidasi hanya boleh template yang ada
 */
export const metaSchema = z.object({
  title: trimmed(80).optional(),
  templateId: TemplateIdSchema.optional(),
});

/**
 * Bodies
 */
export const patchMetaBody = metaSchema;
export const patchProfileBody = z.object({ profile: profileSchema });
export const patchExperienceBody = z.object({
  experience: z.array(experienceItemSchema).max(50),
});
export const patchEducationBody = z.object({
  education: z.array(educationItemSchema).max(50),
});
export const patchSkillsBody = z.object({ skills: skillsSchema });
export const patchExtrasBody = z.object({ extras: extrasSchema });

// ===== Bodies (ADD) =====
export const patchThemeBody = z.object({ theme: themeSchema });
export const patchSectionOrderBody = z.object({ sectionOrder: sectionOrderSchema });
