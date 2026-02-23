import { getSupabaseClient } from "../supabase/clients";

export type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  data: any;
  created_at: string;
  updated_at: string;
};

const DEFAULT_DATA = {
  theme: { fontFamily: "", fontSize: "11px", pagePadding: "10mm" },
  sectionOrder: ["profile", "experience", "education", "skills", "extras"],
  profile: { fullName: "", headline: "", avatarUrl: "", email: "", location: "", summary: "", links: [] },
  experience: [],
  education: [],
  skills: [],
  extras: {},
};

function mergeData(current: any, patch: any) {
  const base = current && typeof current === "object" ? current : {};
  return { ...DEFAULT_DATA, ...base, ...patch };
}

export class ResumeService {
  // Helper internal untuk akses tabel
  private table(token: string) {
    return getSupabaseClient(token).from("resumes");
  }

  async list(accessToken: string): Promise<ResumeRow[]> {
    const { data, error } = await this.table(accessToken)
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as ResumeRow[]) ?? [];
  }

  async create(
    accessToken: string,
    userId: string,
    meta?: { title?: string; templateId?: string }
  ): Promise<ResumeRow> {
    const payload = {
      user_id: userId,
      title: meta?.title ?? "My Resume",
      template_id: meta?.templateId ?? "ats-1",
      data: DEFAULT_DATA,
    };

    const { data, error } = await this.table(accessToken)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  async getById(
    accessToken: string,
    userId: string,
    resumeId: string
  ): Promise<ResumeRow | null> {
    const { data, error } = await this.table(accessToken)
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ResumeRow) ?? null;
  }

  async patchMetaById(
    accessToken: string,
    userId: string,
    resumeId: string,
    meta: { title?: string; templateId?: string }
  ): Promise<ResumeRow> {
    const patch: any = {};
    if (meta.title !== undefined) patch.title = meta.title;
    if (meta.templateId !== undefined) patch.template_id = meta.templateId;

    const { data, error } = await this.table(accessToken)
      .update(patch)
      .eq("id", resumeId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  async patchSectionById(
    accessToken: string,
    userId: string,
    resumeId: string,
    patch: any
  ): Promise<ResumeRow> {
    // Ambil data lama dulu karena tipe datanya JSONB
    const existing = await this.getById(accessToken, userId, resumeId);
    if (!existing) throw new Error("Resume not found");

    const nextData = mergeData(existing.data, patch);

    const { data, error } = await this.table(accessToken)
      .update({ data: nextData })
      .eq("id", resumeId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  async deleteById(accessToken: string, userId: string, resumeId: string): Promise<void> {
    const { error } = await this.table(accessToken)
      .delete()
      .eq("id", resumeId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  }

  async duplicateById(accessToken: string, userId: string, resumeId: string): Promise<ResumeRow> {
    const existing = await this.getById(accessToken, userId, resumeId);
    if (!existing) throw new Error("Resume not found");

    const created = await this.create(accessToken, userId, {
      title: `Copy of ${existing.title ?? "My Resume"}`,
      templateId: existing.template_id,
    });

    const { data, error } = await this.table(accessToken)
      .update({ data: existing.data })
      .eq("id", created.id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }
}