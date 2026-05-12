"use server";

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return { error: error.message };
  redirect("/");
}

export async function loginToSyncCookies(email: string, password: string) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?login=true");
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: "user" },
    },
  });

  if (error) {
    return { error: error.message };
  }
  redirect("/?login=true");
}

export async function registerAndLogin(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const lastname = String(formData.get("lastname") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        lastname,
        phone,
        role: "user",
      },
    },
  });

  if (signUpError) {
    redirect(`/auth/register?error=${encodeURIComponent(signUpError.message)}`);
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    redirect(`/auth/register?error=${encodeURIComponent(signInError.message)}`);
  }

  redirect("/onboarding");
}
