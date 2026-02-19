import { supabaseRls } from "../supabase/clients";

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
  theme: { 
  fontFamily: "",
  fontSize: "11px",
  pagePadding: "10mm"
},
  sectionOrder: ["profile", "experience", "education", "skills", "extras"],
  profile: {
    fullName: "",
    headline: "",
    avatarUrl: "",
    email: "",
    location: "",
    summary: "",
    links: [],
  },
  experience: [],
  education: [],
  skills: [],
  extras: {},
};

// arrays replaced, objects shallow-merged
function mergeData(current: any, patch: any) {
  const base = current && typeof current === "object" ? current : {};
  return { ...DEFAULT_DATA, ...base, ...patch };
}

export class ResumeService {

  // List semua resume milik user
  async list(accessToken: string): Promise<ResumeRow[]> {
    const sb = supabaseRls(accessToken);

    const { data, error } = await sb
      .from("resumes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as ResumeRow[]) ?? [];
  }

  // Create resume baru
  async create(
    accessToken: string,
    userId: string,
    meta?: { title?: string; templateId?: string }
  ): Promise<ResumeRow> {
    const sb = supabaseRls(accessToken);

    const payload: any = {
      user_id: userId,
      title: meta?.title ?? "My Resume",
      template_id: meta?.templateId ?? "ats-1",
      data: DEFAULT_DATA,
    };

    const { data, error } = await sb
      .from("resumes")
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
    const sb = supabaseRls(accessToken);

    const { data, error } = await sb
      .from("resumes")
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
    const sb = supabaseRls(accessToken);

    const patch: any = {};
    if (meta.title !== undefined) patch.title = meta.title;
    if (meta.templateId !== undefined) patch.template_id = meta.templateId;

    const { data, error } = await sb
      .from("resumes")
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
    const sb = supabaseRls(accessToken);

    const existing = await this.getById(accessToken, userId, resumeId);
    if (!existing) throw new Error("Resume not found");

    const nextData = mergeData(existing.data, patch);

    const { data, error } = await sb
      .from("resumes")
      .update({ data: nextData })
      .eq("id", resumeId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  async deleteById(
    accessToken: string,
    userId: string,
    resumeId: string
  ): Promise<void> {
    const sb = supabaseRls(accessToken);

    const { error } = await sb
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", userId); // defense in depth

    if (error) throw new Error(error.message);
  }


  // OPTIONAL: duplicate
  async duplicateById(
    accessToken: string,
    userId: string,
    resumeId: string
  ): Promise<ResumeRow> {
    const existing = await this.getById(accessToken, userId, resumeId);
    if (!existing) throw new Error("Resume not found");

    return this.create(accessToken, userId, {
      title: `Copy of ${existing.title ?? "My Resume"}`,
      templateId: existing.template_id,
    }).then(async (created) => {
      // copy data
      const sb = supabaseRls(accessToken);
      const { data, error } = await sb
        .from("resumes")
        .update({ data: existing.data })
        .eq("id", created.id)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return data as ResumeRow;
    });
  }
}
