import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { Profile } from "@/supabase/models/profile";

export const useProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMutation, setLoadingMutation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", id);
      if (error) throw error;
      setProfiles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener la cuenta",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      setLoadingMutation(true);
      setError(null);
      const { data, error } = await supabase
        .from("profile")
        .update(profileData)
        .eq("id", profileData.id);
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      return { data, error: null, success: true };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar perfil",
      );
      return {
        data: null,
        error:
          err instanceof Error ? err.message : "Error al actualizar perfil",
        success: false,
      };
    } finally {
      setLoadingMutation(false);
    }
  };

  return {
    profiles,
    profile,
    loading,
    loadingMutation,
    error,
    fetchProfileById,
    updateProfile,
  };
};
