// app/api/migrate/folder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { IFolder } from "@/models/Folder";

export async function POST(request: NextRequest) {
  try {
    const { folder } = (await request.json()) as { folder: IFolder };

    // Verificar si la carpeta ya existe en Supabase
    const { data: existingFolder } = await supabase
      .from("folders")
      .select("id")
      .eq("id", folder._id)
      .single();

    if (existingFolder) {
      return NextResponse.json({
        success: false,
        error: "La carpeta ya existe en Supabase",
      });
    }

    // Preparar datos para Supabase (mapeo de campos)
    const supabaseFolder = {
      id: folder._id,
      type: folder.type || "parent",
      title: folder.title,
      description: folder.description || null,
      schoolId: folder.schoolId || null,
      password: folder.password || null,
      isPrivate: folder.isPrivate ?? false,
      imageUrl: folder.imageUrl || null,
      grades: folder.grades || [], // jsonb en Supabase
      parentFolder: folder.parentFolder || null,
      year: folder.year || new Date().getFullYear().toString(),
      level: folder.level || "jardin",
      createdAt: folder.createdAt || new Date().toISOString(),
      updatedAt: folder.updatedAt || new Date().toISOString(),
    };

    // Insertar en Supabase
    const { error } = await supabase.from("folders").insert([supabaseFolder]);

    if (error) {
      console.error("Error al insertar carpeta en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      folder: supabaseFolder,
    });
  } catch (error) {
    console.error("Error en migración de carpeta:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
