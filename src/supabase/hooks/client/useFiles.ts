import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { FileFullDetails } from "@/supabase/models/file";

export const useFiles = () => {
  const [files, setFiles] = useState<FileFullDetails[]>([]);
  const [file, setFile] = useState<FileFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("files")
        .select("*")
        .order("file_name", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener archivos",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesByFolderId = async (folderId: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("files")
        .select("*")
        .eq("folder_id", folderId)
        .order("file_name", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener archivos por carpeta",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFileById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setFile(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener el archivo",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.from("files").delete().eq("id", id);
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: "Archivo eliminado correctamente" };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Error al eliminar el archivo",
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteManyFiles = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.from("files").delete().in("id", ids);
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: "Archivos eliminados correctamente" };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Error al eliminar los archivos",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    file,
    loading,
    error,
    fetchFiles,
    fetchFileById,
    fetchFilesByFolderId,
    deleteFile,
    deleteManyFiles,
  };
};
