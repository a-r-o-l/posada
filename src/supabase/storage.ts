import { supabase } from "./supabase";

const BUCKET_NAME = "posadasbucket";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Función para subir archivo
export async function uploadFile(
  file: File,
  filePath: string,
): Promise<UploadResult> {
  try {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir el archivo:", uploadError);
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Obtener la URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
