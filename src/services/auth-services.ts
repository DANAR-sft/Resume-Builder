import { getSupabaseClient } from "../supabase/clients";

export class AuthService {
    async logout(getSupabaseClient: string, anonKey: string, accessToken: string) {
        const res = await fetch(`${getSupabaseClient}/auth/v1/logout`, {
        method: "POST",
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${accessToken}`
        }
        });

        // Supabase biasanya balikin 204 No Content kalau sukses
        if (!res.ok && res.status !== 204) {
        const text = await res.text().catch(() => "");
        throw new Error(`Logout failed: ${res.status} ${text}`);
        }

        return { success: true };
    }
}

