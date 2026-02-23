"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUpNewUser(
  name: string,
  email: string,
  password: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { display_name: name },
    },
  });

  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
}

export async function signOutUser() {
  const supabase = await createClient();

  try {
    const { authApi } = await import("@/lib/api/auth-api");
    await authApi.logout();
  } catch (error) {
    console.error("Backend logout failed:", error);
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { ok: false, error };
  }
  return { ok: true };
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  return data.user;
}
