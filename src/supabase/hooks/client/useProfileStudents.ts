import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import {
  ProfileStudent,
  ProfileStudentFullDetails,
} from "@/supabase/models/profile_student";

export const useProfileStudents = () => {
  const [profileStudents, setProfileStudents] = useState<
    ProfileStudentFullDetails[]
  >([]);
  const [profileStudent, setProfileStudent] =
    useState<ProfileStudentFullDetails | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileStudentsByAccountId = async (id: string) => {
    try {
      setQueryLoading(true);
      setError(null);

      const query = supabase
        .from("profile_students")
        .select("*, student:students(*, school:schools(*), grade:grades(*))")
        .eq("profile_id", id);

      const { data, error } = await query;

      if (error) throw error;

      setProfileStudents(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener colegios",
      );
    } finally {
      setQueryLoading(false);
    }
  };

  const fetchProfileStudentById = async (id: string) => {
    try {
      setQueryLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profile_students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setProfileStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
      return null;
    } finally {
      setQueryLoading(false);
    }
  };

  const createProfileStudent = async (
    profileStudents: Partial<ProfileStudent>,
  ) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("profile_students")
        .insert(profileStudents);

      if (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Error al crear profile student",
          data: null,
        };
      }
      return {
        data,
        success: true,
        error: null,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Error al crear profile student",
        data: null,
      };
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteProfileStudent = async (accountId: string, studentId: string) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { error } = await supabase
        .from("profile_students")
        .delete()
        .eq("profile_id", accountId)
        .eq("student_id", studentId);

      if (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Error al eliminar profile student",
        };
      }
      return {
        success: true,
        error: null,
      };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Error al eliminar profile student",
      };
    } finally {
      setMutationLoading(false);
    }
  };

  return {
    profileStudents,
    profileStudent,
    queryLoading,
    mutationLoading,
    error,
    fetchProfileStudentsByAccountId,
    fetchProfileStudentById,
    createProfileStudent,
    deleteProfileStudent,
  };
};
