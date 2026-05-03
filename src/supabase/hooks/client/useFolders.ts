import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { Folder, FolderFullDetails } from "@/supabase/models/folder";

export const useFolders = () => {
  const [folders, setFolders] = useState<FolderFullDetails[]>([]);
  const [folder, setFolder] = useState<FolderFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFoldersBySchoolYearLevel = async (
    schoolId: string,
    year: string,
    level: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("folders")
        .select(`*`)
        .eq("school_id", schoolId)
        .eq("year", year)
        .eq("level", level)
        .order("title", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setFolders(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener carpetas",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGradesBySchoolId = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("school_id", id);
      if (error) throw error;
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener cursos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("folders")
        .select("*, school:schools(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      setFolder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener carpeta");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { error } = await supabase.from("folders").delete().eq("id", id);
      if (error) throw error;
      return { success: true, message: "Carpeta eliminada correctamente" };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar carpeta",
      );
      return { success: false, message: "Error al eliminar carpeta" };
    } finally {
      setMutationLoading(false);
    }
  };

  const updateFolder = async (
    id: string,
    folderData: Partial<Folder>,
  ): Promise<{ success: boolean; message: string }> => {
    if (!id) {
      return { success: false, message: "ID de carpeta no proporcionado" };
    }
    try {
      setMutationLoading(true);
      setError(null);
      // Filtrar undefined values (opcional, pero útil)
      const updates = Object.fromEntries(
        Object.entries(folderData).filter(([_, value]) => value !== undefined),
      );
      if (Object.keys(updates).length === 0) {
        return { success: false, message: "No hay datos para actualizar" };
      }
      const { error } = await supabase
        .from("folders")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      return { success: true, message: "Carpeta actualizada correctamente" };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar carpeta";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setMutationLoading(false);
    }
  };

  const createFolder = async (
    folderData: Partial<Folder>,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setMutationLoading(true);
      setError(null);

      const { error } = await supabase.from("folders").insert(folderData);
      if (error) throw error;

      return { success: true, message: "Carpeta creada correctamente" };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear carpeta";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setMutationLoading(false);
    }
  };

  return {
    folders,
    folder,
    loading,
    error,
    fetchFoldersBySchoolYearLevel,
    fetchGradesBySchoolId,
    fetchFolderById,
    mutationLoading,
    deleteFolder,
    updateFolder,
    createFolder,
  };
};
