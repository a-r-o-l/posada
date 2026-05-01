import { create } from "zustand";
import { supabase } from "@/supabase/supabase";
import { Profile } from "@/supabase/models/profile";

interface AuthStore {
  // Estado actual
  currentUser: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  linkGoogleProvider: () => Promise<void>;

  // Acciones
  setCurrentUser: (user: Profile | null) => void;
  initializeAuth: () => Promise<void>;
  refreshUser: () => Promise<void>; // Nueva función para recargar datos
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  lastname: string;
  phone?: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,

  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),

  initializeAuth: async () => {
    set({ isLoading: true });

    try {
      // Obtener sesión actual
      const {
        data: { user: us },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error obteniendo sesión:", error);
        set({ isLoading: false });
        return;
      }

      if (!us) {
        set({
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      // Obtener datos del perfil del usuario
      const { data: userData, error: userError } = await supabase
        .from("profile")
        .select("*")
        .eq("id", us.id)
        .single();

      if (userError) {
        console.error("Error obteniendo perfil:", userError);
        set({ isLoading: false });
        return;
      }

      // Formatear datos del usuario
      const user: Profile = {
        ...userData,
      };

      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Escuchar cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          set({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      });
    } catch (error) {
      console.error("Error inicializando auth:", error);
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      // Obtener sesión actual
      const {
        data: { user: us },
        error,
      } = await supabase.auth.getUser();

      if (error || !us) {
        console.error("Error obteniendo sesión:", error);
        return;
      }

      // Obtener datos actualizados del perfil del usuario
      const { data: userData, error: userError } = await supabase
        .from("profile")
        .select("*")
        .eq("id", us.id)
        .single();

      if (userError) {
        console.error("Error obteniendo perfil:", userError);
        return;
      }

      // Formatear datos del usuario
      const user: Profile = {
        ...userData,
      };

      set({
        currentUser: user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error recargando usuario:", error);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      // Autenticación con Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        console.error("Error de autenticación:", authError);
        set({ isLoading: false });
        return false;
      }

      if (!authData.user) {
        set({ isLoading: false });
        return false;
      }

      // Obtener datos del perfil del usuario
      const { data: userData, error: userError } = await supabase
        .from("profile")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.error("Error obteniendo perfil:", userError);
        set({ isLoading: false });
        return false;
      }

      // Formatear datos del usuario (ahora todo está en una tabla)
      const user: Profile = userData;

      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await supabase.auth.signOut();

      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error en logout:", error);
      set({ isLoading: false });
    }
  },

  register: async (userData: RegisterData) => {
    set({ isLoading: true });

    try {
      // Registro con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
          },
        },
      });

      if (authError) {
        console.error("Error en registro:", authError);
        set({ isLoading: false });
        return false;
      }

      if (!authData.user) {
        set({ isLoading: false });
        return false;
      }

      // El trigger handle_new_user() se encarga de crear el perfil automáticamente
      // No necesitamos insertar manualmente

      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      set({ isLoading: false });
      return false;
    }
  },

  updateProfile: async (data: Partial<Profile>) => {
    const { currentUser } = get();
    if (!currentUser) return false;

    set({ isLoading: true });

    try {
      // Aquí irá la lógica real de actualización
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = { ...currentUser, ...data, updatedAt: new Date() };
      set({ currentUser: updatedUser, isLoading: false });
      return true;
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      set({ isLoading: false });
      return false;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        console.error("Error en login con Google:", error);
        set({ isLoading: false });
        throw error;
      }
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  linkGoogleProvider: async () => {
    const { currentUser } = get();
    if (!currentUser) throw new Error("No hay usuario autenticado");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error obteniendo sesión:", sessionError);
        throw sessionError;
      }

      if (!sessionData.session) {
        throw new Error("No hay sesión activa");
      }

      const { error: linkError } = await supabase.auth.linkIdentity({
        provider: "google",
        token: sessionData.session.access_token,
      });

      if (linkError) {
        console.error("Error vinculando proveedor Google:", linkError);
        throw linkError;
      }
    } catch (error) {
      console.error("Error en linkGoogleProvider:", error);
      throw error;
    }
  },
}));
