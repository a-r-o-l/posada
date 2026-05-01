"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  role: "admin" | "user";
  phone?: string;
  image_url?: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  lastname: string;
  phone?: string;
  role?: "admin" | "user";
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profile")
      .select("id, email, name, lastname, role, phone, image_url")
      .eq("id", user.id)
      .single();

    if (profile) {
      setUser(profile as User);
    }

    setIsLoading(false);
  };

  const signup = async (userData: SignupData) => {
    // 1. Crear el usuario en auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          lastname: userData.lastname,
          phone: userData.phone || null,
        },
      },
    });
    if (signUpError) return { success: false, error: signUpError.message };
    if (!authData.user) {
      return {
        success: false,
        error: "No se pudo crear el usuario, intente nuevamente.",
      };
    }
    // 2. El perfil se crea automáticamente con un trigger en la DB
    // Pero si necesitas actualizar algún campo adicional:
    const { error: profileError } = await supabase
      .from("profile")
      .update({
        name: userData.name,
        lastname: userData.lastname,
        phone: userData.phone || null,
        role: userData.role || "user",
      })
      .eq("id", authData.user.id);
    if (profileError) {
      return {
        success: false,
        error:
          "Usuario creado pero no se pudo actualizar el perfil. Intente iniciar sesión.",
      };
    }
    // 3. Hacer login automático (opcional, Supabase ya debería tener la sesión)
    // Pero esperamos un momento para que la sesión se establezca
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 4. Obtener el usuario actual
    await getUser();
    router.refresh();
    return { success: true, error: null };
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return false;

    await getUser();
    router.refresh();
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin, // Redirige a tu home
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      // No necesitas hacer nada más, Supabase redirige automáticamente
    } catch (error) {
      console.error("Error en login con Google:", error);
      setIsLoading(false);
    }
  };

  return { user, isLoading, login, logout, signup, loginWithGoogle };
}
