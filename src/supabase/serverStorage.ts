"use server";
import { createClient } from "@/supabase/server"; // Cliente server

const BUCKET_NAME = "posadasbucket";

export async function serverUploadFile(
  file: File,
  filePath: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Convertir File a Buffer (necesario en servidor)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir archivo:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("Error en uploadFile:", error);
    return { success: false, error: "Error al procesar el archivo" };
  }
}
