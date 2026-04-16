import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { IFile } from "@/models/File";

export async function POST(request: NextRequest) {
  try {
    const { file } = (await request.json()) as { file: IFile };

    // Verificar si el archivo ya existe en Supabase
    const { data: existingFile } = await supabase
      .from("files")
      .select("id")
      .eq("id", file._id)
      .single();

    if (existingFile) {
      return NextResponse.json({
        success: false,
        error: "El archivo ya existe en Supabase",
      });
    }

    // Preparar datos para Supabase (mapeo de campos)
    const supabaseFile = {
      id: file._id,
      fileName: file.fileName,
      title: file.title,
      description: file.description || null,
      folderId: file.folderId || null,
      imageUrl: file.imageUrl || null,
      originalImageUrl: file.originalImageUrl || null,
      price: file.price ?? 0,
      isNew: file.isNew ?? true,
      createdAt: file.createdAt || new Date().toISOString(),
      updatedAt: file.updatedAt || new Date().toISOString(),
    };

    // Insertar en Supabase
    const { error } = await supabase.from("files").insert([supabaseFile]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      file: supabaseFile,
    });
  } catch (error) {
    console.error("Error en migración de archivo:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
