import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { FileFullDetails } from "@/supabase/models/file";
import { deleteFileFromBucket, extractBucketPath } from "@/supabase/storage";

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

  const deleteManyFiles = async (filesToDelete: FileFullDetails[]) => {
    try {
      setLoading(true);
      setError(null);

      // PASO 1: Eliminar archivos del bucket (originales y con marca de agua)
      const bucketErrors: Array<{
        fileId: string;
        fileName: string;
        error: string;
      }> = [];

      for (const file of filesToDelete) {
        // Construir las rutas según tu estructura de carpetas
        const pathsToDelete: string[] = [];

        // Ruta de la foto con marca de agua (la que se muestra en la tienda)
        if (file.image_url) {
          const path = extractBucketPath(file.image_url);
          if (path) pathsToDelete.push(path);
        }

        if (file.original_image_url) {
          const path = extractBucketPath(file.original_image_url);
          if (path) pathsToDelete.push(path);
        }

        // Eliminar cada archivo del bucket
        for (const path of pathsToDelete) {
          const result = await deleteFileFromBucket(path);
          if (!result.success) {
            bucketErrors.push({
              fileId: file.id,
              fileName: file.title || file.id,
              error:
                result?.error || "Error desconocido al eliminar del bucket",
            });
          }
        }
      }

      // PASO 2: Eliminar los registros de la base de datos
      const fileIds = filesToDelete.map((file) => file.id);
      const { error: dbError } = await supabase
        .from("files")
        .delete()
        .in("id", fileIds);

      if (dbError) {
        // Si falló la eliminación en DB, pero algunos archivos ya se borraron del bucket
        // queda inconsistencia. Mejor avisar y revertir? (complicado)
        return {
          success: false,
          message: `Error al eliminar registros: ${dbError.message}`,
          bucketErrors: bucketErrors.length > 0 ? bucketErrors : undefined,
        };
      }

      // PASO 3: Reportar resultados
      if (bucketErrors.length > 0) {
        return {
          success: true, // Los registros se eliminaron, pero hubo errores en el bucket
          message: `Archivos eliminados, pero ${bucketErrors.length} archivo(s) no pudieron eliminarse del almacenamiento. Pueden quedar huérfanos.`,
          bucketErrors,
        };
      }

      return {
        success: true,
        message: `${filesToDelete.length} archivo(s) eliminados correctamente`,
      };
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

  const updateFile = async (id: string, updates: Partial<FileFullDetails>) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase
        .from("files")
        .update(updates)
        .eq("id", id)
        .single();
      if (error) throw error;
      return { success: true, message: "Archivo actualizado correctamente" };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Error al actualizar el archivo",
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
    updateFile,
  };
};
