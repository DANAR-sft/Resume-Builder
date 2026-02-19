export const TEMPLATE_IDS = [
  "ats-1",
  "executive-1",
  "modern-tech-1",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(v: string): v is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(v);
}

export class TemplateService {
  listIds(): TemplateId[] {
    return [...TEMPLATE_IDS];
  }

  exists(templateId: string): boolean {
    return isTemplateId(templateId);
  }
}
