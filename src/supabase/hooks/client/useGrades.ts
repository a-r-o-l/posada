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

  const fetchGradesBySchoolIdAndYear = async (
    schoolId: string,
    year: string,
  ) => {
    let query = supabase
      .from("grades")
      .select("*")
      .order("display_name", { ascending: true });

    if (!schoolId || !year) {
      setGrades([]);
      return [];
    }
    if (schoolId) {
      query = query.eq("school_id", schoolId);
    }
    if (year) {
      query = query.eq("year", year);
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await query;
      if (error) throw error;
      setGrades(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener cursos");
      setGrades([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createGrade = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("grades")
        .insert({
          grade: formData.get("grade") as string,
          division: formData.get("division") as string,
          year: formData.get("year") as string,
          display_name: formData.get("display_name") as string,
          school_id: formData.get("school_id") as string,
        })
        .select()
        .single();
      if (error) throw error;
      return { success: true, message: "Curso creado correctamente", data };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear el curso";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = async (formData: FormData, id: string) => {
    try {
      const payload = {
        grade: formData.get("grade") as string,
        division: formData.get("division") as string,
        year: formData.get("year") as string,
        display_name: formData.get("display_name") as string,
      };
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("grades")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return {
        success: true,
        message: "Curso actualizado correctamente",
        data,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el curso";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const deleteGrade = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.from("grades").delete().eq("id", id);
      if (error) throw error;
      return { success: true, message: "Curso eliminado correctamente" };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar el curso";
      setError(message);
      return { success: false, message };
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
    fetchGradesBySchoolIdAndYear,
    createGrade,
    updateGrade,
    deleteGrade,
  };
};
