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

  return {
    schools,
    school,
    loading,
    error,
    fetchSchools,
    fetchSchoolById,
  };
};
