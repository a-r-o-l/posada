import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { StudentFullDetails } from "@/supabase/models/student";

export const useStudents = () => {
  const [students, setStudents] = useState<StudentFullDetails[]>([]);
  const [student, setStudent] = useState<StudentFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = supabase.from("students").select("*");

      const { data, error } = await query;

      if (error) throw error;

      setStudents(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener colegios",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByGradeId = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("grade_id", id);
      if (error) throw error;
      setStudents(data);
      return {
        success: true,
        error: null,
        data,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
      setStudents([]);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error al obtener colegio",
        data: [],
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByGradeIdAndFullName = async (
    id: string,
    fullName: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("students").select("*").eq("grade_id", id);

      if (fullName && fullName.trim()) {
        const searchTerm = fullName.trim().toLowerCase();
        const [firstName, ...lastNameParts] = searchTerm.split(/\s+/);
        const lastName = lastNameParts.join(" ");

        // Buscar estudiantes donde el nombre Y apellido coincidan parcialmente
        if (lastName) {
          // Si tenemos nombre y apellido separados
          query = query
            .ilike("name", `%${firstName}%`)
            .ilike("lastname", `%${lastName}%`);
        } else {
          // Si solo es un nombre o apellido
          query = query.or(
            `name.ilike.%${firstName}%,lastname.ilike.%${firstName}%`,
          );
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      setStudents(data || []);
      return {
        success: true,
        error: null,
        data: data || [],
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener estudiantes",
      );
      setStudents([]);
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Error al obtener estudiantes",
        data: [],
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsBySchoolId = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("students")
        .select("*, school:schools(*), grade:grades(*)")
        .eq("school_id", id);
      if (error) throw error;
      setStudents(data);
      return {
        success: true,
        error: null,
        data,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
      setStudents([]);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error al obtener colegio",
        data: [],
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    student,
    loading,
    error,
    fetchStudents,
    fetchStudentById,
    fetchStudentsByGradeId,
    fetchStudentsBySchoolId,
    fetchStudentsByGradeIdAndFullName,
  };
};
