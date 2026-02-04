import { supabaseRls } from "../supabase/clients";
import { randomUUID } from "crypto";

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
  profile: {
    fullName: "",
    headline: "",
    avatarUrl: "",
    email: "",
    location: "",
    summary: "",
    links: []
  },
  experience: [],
  education: [],
  skills: [],
  extras: {}
};

// arrays replaced, objects shallow-merged per top-level section
function mergeData(current: any, patch: any) {
  // Jika database memberikan null, gunakan DEFAULT_DATA
  const base = (current && typeof current === "object") ? current : DEFAULT_DATA;
  const p = (patch && typeof patch === "object") ? patch : {};

  const next: any = { ...base, ...p };

  for (const key of Object.keys(p)) {
    const pv = p[key];
    const bv = base[key];

    const isObj = (v: any) => v && typeof v === "object" && !Array.isArray(v);

    if (isObj(pv) && isObj(bv)) {
      next[key] = { ...bv, ...pv };
    } else {
      next[key] = pv;
    }
  }
  return next;
}

export class ResumeService {
  [x: string]: any;

  async get(accessToken: string, userId: string): Promise<ResumeRow | null> {
    return this.getByUserId(accessToken, userId);
  }

  async getByUserId(accessToken: string, userId: string): Promise<ResumeRow | null> {
    const sb = supabaseRls(accessToken);

    const { data, error } = await sb
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ResumeRow) ?? null;
  }

 async patchMeta(
    accessToken: string,
    userId: string,
    meta: { title?: string; templateId?: string }
  ): Promise<ResumeRow> {
    const sb = supabaseRls(accessToken);
    const existing = await this.getByUserId(accessToken, userId);

    const id = existing?.id ?? randomUUID();

    const payload = {
      id,
      user_id: userId,
      title: meta.title ?? existing?.title ?? "My Resume",
      template_id: meta.templateId ?? existing?.template_id ?? "modern-1",
      data: existing?.data ?? DEFAULT_DATA,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await sb
      .from("resumes")
      .upsert(payload, { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }


  async patchSection(
    accessToken: string,
    userId: string,
    patch: any
  ): Promise<ResumeRow> {
    const sb = supabaseRls(accessToken);
    const existing = await this.getByUserId(accessToken, userId);

    const id = existing?.id ?? randomUUID(); // ✅ also needed here
    const nextData = mergeData(existing?.data, patch);

    const payload: ResumeRow | any = {
      id,
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
