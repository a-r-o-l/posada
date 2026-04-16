import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { IProduct } from "@/models/Product";

export async function POST(request: NextRequest) {
  try {
    const { product } = (await request.json()) as { product: IProduct };

    // Verificar si el producto ya existe en Supabase
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id")
      .eq("id", product._id)
      .single();

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: "El producto ya existe en Supabase",
      });
    }

    // Preparar datos para Supabase
    const supabaseProduct = {
      id: product._id,
      name: product.name,
      description: product.description || null,
      price: product.price,
      schoolId: product.schoolId,
      isDownloadable: product.isDownloadable ?? false,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    };

    // Insertar en Supabase
    const { error } = await supabase.from("products").insert([supabaseProduct]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      product: supabaseProduct,
    });
  } catch (error) {
    console.error("Error en migración:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
