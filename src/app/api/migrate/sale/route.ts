// app/api/migrate/sale/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { ISale } from "@/models/Sale";

export async function POST(request: NextRequest) {
  try {
    const { sale } = (await request.json()) as { sale: ISale };

    // Verificar si la venta ya existe en Supabase
    const { data: existingSale } = await supabase
      .from("sales")
      .select("id")
      .eq("id", sale._id)
      .single();

    if (existingSale) {
      return NextResponse.json({
        success: false,
        error: "La venta ya existe en Supabase",
      });
    }

    // Preparar datos para Supabase (mapeo de campos)
    const supabaseSale = {
      id: sale._id,
      order: sale.order,
      preferenceId: sale.preferenceId || null,
      accountId: sale.accountId,
      total: sale.total,
      status: sale.status || "pending",
      statusDetail: sale.statusDetail || null,
      delivered: sale.delivered ?? false,
      products: sale.products || [],
      transactionId: sale.transactionId || null,
      transferProofUrl: sale.transferProofUrl || null,
      transferStatus: sale.transferStatus || null,
      transferNote: sale.transferNote || null,
      dateCreated:
        sale.dateCreated || sale.createdAt || new Date().toISOString(),
      dateApproved: sale.dateApproved || null,
      paymentMethodId: sale.paymentMethodId || null,
      paymentTypeId: sale.paymentTypeId || null,
      collector_id: sale.collector_id || null, // Mantiene el nombre original
      payer: sale.payer || null,
      isNewSale: sale.isNewSale ?? true,
      createdAt: sale.createdAt || new Date().toISOString(),
      updatedAt: sale.updatedAt || new Date().toISOString(),
    };

    // Insertar en Supabase
    const { error } = await supabase.from("sales").insert([supabaseSale]);

    if (error) {
      console.error("Error al insertar venta en Supabase:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      sale: supabaseSale,
    });
  } catch (error) {
    console.error("Error en migración de venta:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
