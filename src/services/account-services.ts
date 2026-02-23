import { getSupabaseClient } from "../supabase/clients";

export class AccountService {
  async getAccount(accessToken: string) {
    const sb = getSupabaseClient(accessToken);

    const { data, error } = await sb.auth.getUser();
    if (error || !data.user) throw new Error(error?.message ?? "Failed to get user");

    const md = (data.user.user_metadata ?? {}) as Record<string, any>;
    return {
      id: data.user.id,
      email: data.user.email ?? null,
      displayName: typeof md.display_name === "string" ? md.display_name : null
    };
  }

  async updateDisplayName(accessToken: string, displayName: string) {
    const sb = getSupabaseClient(accessToken);

    const { data, error } = await sb.auth.updateUser({
      data: { display_name: displayName }
    });

    if (error || !data.user) throw new Error(error?.message ?? "Failed to update display name");

    const md = (data.user.user_metadata ?? {}) as Record<string, any>;
    return {
      id: data.user.id,
      email: data.user.email ?? null,
      displayName: typeof md.display_name === "string" ? md.display_name : null
    };
  }
}
function supabaseRls(accessToken: string) {
  throw new Error("Function not implemented.");
}

