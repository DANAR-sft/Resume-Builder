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

// arrays replaced, objects shallow-merged
function mergeData(current: any, patch: any) {
  const base = current && typeof current === "object" ? current : {};
  return { ...DEFAULT_DATA, ...base, ...patch };
}

export class ResumeService {
  // Ambil "resume aktif" = resume terbaru (biar endpoint lama tetap bisa dipakai)
  async get(accessToken: string): Promise<ResumeRow | null> {
    const sb = supabaseRls(accessToken);

    const { data, error } = await sb
      .from("resumes")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ResumeRow) ?? null;
  }

  // BARU: list semua resume milik user (buat UI choose resume nantinya)
  async list(accessToken: string): Promise<ResumeRow[]> {
    const sb = supabaseRls(accessToken);

    const { data, error } = await sb
      .from("resumes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as ResumeRow[]) ?? [];
  }

  // BARU: create resume baru untuk user yang sama
  async create(accessToken: string, userId: string, meta?: { title?: string; templateId?: string }) {
    const sb = supabaseRls(accessToken);

    const payload: any = {
      user_id: userId,
      title: meta?.title ?? "My Resume",
      template_id: meta?.templateId ?? "ats-1",
      data: DEFAULT_DATA
    };

    const { data, error } = await sb
      .from("resumes")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  // NAMA SAMA, tapi logic diubah:
  // - kalau ada resume aktif => UPDATE by id
  // - kalau belum ada => INSERT pertama
  async patchMeta(accessToken: string, userId: string, meta: { title?: string; templateId?: string }) {
    const sb = supabaseRls(accessToken);
    const existing = await this.get(accessToken);

    if (!existing) {
      // belum ada resume sama sekali => buat baru
      return this.create(accessToken, userId, meta);
    }

    const patch: any = {
      title: meta.title ?? existing.title,
      template_id: meta.templateId ?? existing.template_id
    };

    const { data, error } = await sb
      .from("resumes")
      .update(patch)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }

  // NAMA SAMA, tapi logic diubah:
  // - update resume aktif (terbaru)
  async patchSection(accessToken: string, userId: string, patch: any) {
    const sb = supabaseRls(accessToken);
    const existing = await this.get(accessToken);

    if (!existing) {
      // belum ada resume => buat baru + set data hasil patch
      const payload: any = {
        user_id: userId,
        title: "My Resume",
        template_id: "ats-1",
        data: mergeData(DEFAULT_DATA, patch)
      };

      const { data, error } = await sb
        .from("resumes")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return data as ResumeRow;
    }

    const nextData = mergeData(existing.data, patch);

    const { data, error } = await sb
      .from("resumes")
      .update({ data: nextData })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ResumeRow;
  }
}
