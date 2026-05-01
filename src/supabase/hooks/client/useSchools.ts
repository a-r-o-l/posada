import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { SchoolFullDetails } from "@/supabase/models/school";

export const useSchools = () => {
  const [schools, setSchools] = useState<SchoolFullDetails[]>([]);
  const [school, setSchool] = useState<SchoolFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from("schools")
        .select(
          `
          *,
          grades:grades (
            *)
        `,
        )
        .order("name", { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      setSchools(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener colegios",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setSchool(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("schools")
        .insert({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          password: formData.get("password") as string,
          is_private: formData.get("isPrivate") === "true",
          image_url: formData.get("imageUrl") as string,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el colegio",
      );
      return { success: false, message: error || "Error desconocido" };
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("schools")
        .update({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          password: formData.get("password") as string,
          is_private: formData.get("isPrivate") === "true",
          image_url: formData.get("imageUrl") as string,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el colegio",
      );
      return { success: false, message: error || "Error desconocido" };
    } finally {
      setLoading(false);
    }
  };

  const fetchSchool = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setSchool(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
    } finally {
      setLoading(false);
    }
  };

  return {
    schools,
    school,
    loading,
    error,
    fetchSchools,
    fetchSchoolById,
    fetchSchool,
    createSchool,
    updateSchool,
  };
};
