import { redirect } from "next/navigation";
import type { Profile } from "@/supabase/models/profile";
import { createClient } from "@/supabase/server";

// Obtener usuario actual (seguro, usa getUser)
export const getCurrentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
};

// Obtener perfil completo del usuario
export const getCurrentProfile = async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return profile as Profile;
};

// Verificar si hay sesión activa (para Server Components)
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

// Redirigir si no está autenticado (para páginas protegidas)
export const requireAuth = async (redirectTo: string = "/login") => {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect(redirectTo);
  }
};

// Redirigir si está autenticado (para páginas como login/register)
export const requireGuest = async (redirectTo: string = "/") => {
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect(redirectTo);
  }
};
