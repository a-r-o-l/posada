import { NextResponse, NextRequest } from "next/server";
import { uploadFile } from "@/supabase/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;
    if (!file) {
      return NextResponse.json(
        { message: "La imagen es requerida" },
        { status: 400 },
      );
    }
    const imageUrl = await uploadFile(file, folder);
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Error al subir la imagen",
    });
  }
}
