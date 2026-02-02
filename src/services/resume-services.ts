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
  profile: { fullName: "" },
  experience: [],
  education: [],
  skills: [],
  extras: {}
};

// arrays replaced, objects shallow-merged
function mergeData(current: any, patch: any) {
  const base = current && typeof current === "object" ? current : {};
  return { ...DEFAULT_DATA, ...base, ...patch };
}

export class ResumeService {
  async get(accessToken: string): Promise<ResumeRow | null> {
    const sb = supabaseRls(accessToken);

    const { data, error } = await sb
      .from("resumes")
      .select("*")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ResumeRow) ?? null;
  }

  async patchMeta(accessToken: string, userId: string, meta: { title?: string; templateId?: string }) {
    const sb = supabaseRls(accessToken);
    const existing = await this.get(accessToken);

    const payload: any = {
      user_id: userId,
      title: meta.title ?? existing?.title ?? "My Resume",
      template_id: meta.templateId ?? existing?.template_id ?? "modern-1",
      data: existing?.data ?? DEFAULT_DATA
    };

    const { data, error } = await sb
      .from("resumes")
      .upsert(payload, { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  async patchSection(accessToken: string, userId: string, patch: any) {
    const sb = supabaseRls(accessToken);
    const existing = await this.get(accessToken);

    const nextData = mergeData(existing?.data, patch);

    const payload: any = {
      user_id: userId,
      title: existing?.title ?? "My Resume",
      template_id: existing?.template_id ?? "modern-1",
      data: nextData
    };

    const { data, error } = await sb
      .from("resumes")
      .upsert(payload, { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }
}
