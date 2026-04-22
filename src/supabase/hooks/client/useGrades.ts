import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { Grade } from "@/supabase/models/grade";

export const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("grades")
        .select(
          `*
        `,
        )
        .order("name", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setGrades(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener cursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchGradesBySchoolId = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("grades")
        .select("*")
        .eq("school_id", id);
      if (error) throw error;
      setGrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener cursos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    grades,
    grade,
    loading,
    error,
    fetchGrades,
    fetchGradesBySchoolId,
  };
};
