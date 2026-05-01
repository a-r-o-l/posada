"use server";

import { generateRandomNumber } from "@/lib/utilsFunctions";
import { createClient } from "@/supabase/server";
import { serverUploadFile } from "@/supabase/serverStorage";

export const createTransferSale = async (payload: FormData) => {
  const supabase = await createClient();
  const formData = Object.fromEntries(payload.entries());
  const parsedProducts = JSON.parse(formData.products as string);
  let transferProofUrl = "";
  if (payload.get("transferProof")) {
    const file = payload.get("transferProof") as File;
    // const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    // Carpeta para comprobantes de transferencia
    const folder = "transfer";
    // Nombre único para el archivo
    const filename = `${Date.now()}_${file.name}`;
    const { url } = await serverUploadFile(file, `${folder}/${filename}`);
    transferProofUrl = url ?? "";
  }
  const { data, error } = await supabase
    .from("sales")
    .insert({
      account_id: formData.accountId,
      total: formData.total,
      status: "pending",
      delivered: false,
      products: parsedProducts,
      payment_type_id: "transfer",
      transfer_proof_url: transferProofUrl || undefined,
      transfer_status: transferProofUrl ? "uploaded" : "pending",
      order: generateRandomNumber(12),
    })
    .select()
    .single();
  if (error) {
    console.error("Error creating sale:", error);
    return {
      success: false,
      message: "Error al crear la venta por transferencia, intente nuevamente",
      sale: null,
    };
  }
  return {
    success: true,
    message: "Venta por transferencia creada correctamente",
    sale: JSON.parse(JSON.stringify(data)),
  };
};
