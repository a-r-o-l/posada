import { supabase } from "./supabase";

const BUCKET_NAME = "posadasbucket";

const BATCH_SIZE = 5; // Procesar 5 imágenes a la vez
const DELAY_BETWEEN_BATCHES = 1000; // 1 segundo entre batches

// Función helper para delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

interface CreateFileData {
  fileName: string;
  title: string;
  description: string;
  price: string;
  folderId: string;
  imageFile?: File; // Cambiamos imageUrl por imageFile para subir al storage
  watermarkedFile?: File; // Archivo de imagen con marca de agua (opcional)
}

async function uploadFileWithRetry(
  file: File,
  filePath: string,
  retries = 3,
  delayMs = 1000,
): Promise<UploadResult> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await uploadFile(file, filePath);
      if (result.success) return result;

      if (attempt === retries) return result;
      await delay(delayMs * attempt);
    } catch (error) {
      if (attempt === retries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        };
      }
      await delay(delayMs * attempt);
    }
  }
  return { success: false, error: "Max retries exceeded" };
}

export const createManyFilesSpb = async (
  filesData: Array<CreateFileData>,
  folderId: string,
  onProgress?: (current: number, total: number) => void, // 👈 Callback de progreso
) => {
  const total = filesData.length;
  let processed = 0;
  const results = [];
  const errors: Array<{ file: string; error: string }> = [];

  try {
    // Procesar por BATCHES
    for (let i = 0; i < filesData.length; i += BATCH_SIZE) {
      const batch = filesData.slice(i, i + BATCH_SIZE);

      // Procesar batch en paralelo
      const batchPromises = batch.map(async (fileData) => {
        let imageUrl = "";
        let watermarkUrl = "";

        try {
          // Subir imagen original
          if (fileData.imageFile) {
            const fileName = fileData.imageFile.name;
            const filePathOriginal = `folders/${folderId}/original/${Date.now()}_${fileName}`;

            const uploadResult = await uploadFileWithRetry(
              fileData.imageFile,
              filePathOriginal,
              3,
              1000,
            );

            if (!uploadResult.success) {
              errors.push({
                file: fileData.fileName,
                error: uploadResult.error || "Error subiendo original",
              });
              return null;
            }
            imageUrl = uploadResult.url || "";

            // Subir marca de agua
            if (fileData.watermarkedFile) {
              const filePath = `folders/${folderId}/${Date.now()}_${fileName}`;
              const watermarkResult = await uploadFileWithRetry(
                fileData.watermarkedFile,
                filePath,
                3,
                1000,
              );

              if (!watermarkResult.success) {
                errors.push({
                  file: fileData.fileName,
                  error: watermarkResult.error || "Error subiendo watermark",
                });
                return null;
              }
              watermarkUrl = watermarkResult.url || "";
            }
          }

          // Preparar registro para BD
          const fileToInsert = {
            file_name: fileData.fileName,
            title: fileData.title,
            description: fileData.description,
            price: parseFloat(fileData.price),
            folder_id: fileData.folderId,
            image_url: watermarkUrl,
            original_image_url: imageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Insertar en BD sin esperar confirmación
          const { error } = await supabase.from("files").insert(fileToInsert);

          if (error) {
            errors.push({ file: fileData.fileName, error: error.message });
            return null;
          }

          return fileToInsert;
        } catch (error) {
          errors.push({
            file: fileData.fileName,
            error: error instanceof Error ? error.message : "Error desconocido",
          });
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter((r) => r !== null);
      results.push(...validResults);

      processed += batch.length;
      if (onProgress) {
        onProgress(processed, total);
      }

      // Esperar entre batches para no saturar
      if (i + BATCH_SIZE < filesData.length) {
        await delay(DELAY_BETWEEN_BATCHES);
      }
    }

    return {
      success: errors.length === 0,
      message:
        errors.length === 0
          ? `${results.length} archivos creados correctamente.`
          : `${results.length} archivos creados, ${errors.length} errores.`,
      files: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error("Error creando los archivos:", error);
    return {
      success: false,
      message: "Error al crear los archivos, intente nuevamente.",
      errors: [
        {
          file: "general",
          error: error instanceof Error ? error.message : "Error desconocido",
        },
      ],
    };
  }
};
