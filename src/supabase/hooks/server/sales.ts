import { generateRandomNumber } from "@/lib/utilsFunctions";
import { createClient } from "@/supabase/server";
// import { serverUploadFile } from "@/supabase/serverStorage";

interface GetAllSalesByDateParams {
  start?: string;
  end?: string;
  state?: string;
  delivered?: string;
}

export async function getAllSalesByDate({
  start,
  end,
  state,
  delivered,
}: GetAllSalesByDateParams = {}) {
  const supabase = await createClient();

  let query = supabase.from("sales").select("*");

  // Usar cast a date (igual que funcionó en SQL)
  if (start) {
    query = query.gte("date_created::date", start);
  }

  if (end) {
    query = query.lte("date_created::date", end);
  }

  if (state && state !== "all") {
    query = query.eq("status", state);
  }

  if (delivered !== undefined && delivered !== "all") {
    query = query.eq("delivered", delivered === "delivered" ? true : false);
  }

  const { data: sales, error } = await query.order("date_created", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching sales:", error);
    return { sales: [], error: error.message };
  }

  return { sales: sales || [], error: null };
}

export async function getSaleById(id: string) {
  const supabase = await createClient();
  const { data: sale, error } = await supabase
    .from("sales")
    .select("*, profile:profile(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching sale by ID:", error);
    return { data: null, error: error.message };
  }

  return { data: sale, error: null };
}

export async function updateSale(id: string, payload: FormData) {
  const supabase = await createClient();
  const formData = Object.fromEntries(payload.entries());

  // Parsear payer si existe
  if (formData.payer) {
    formData.payer = JSON.parse(formData.payer as string);
  }

  // Eliminar campos undefined o null que puedan causar problemas
  Object.keys(formData).forEach((key) => {
    if (formData[key] === undefined || formData[key] === null) {
      delete formData[key];
    }
  });

  const { data, error } = await supabase
    .from("sales")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando la venta:", error);
    return {
      success: false,
      message: "Error al actualizar la venta, intente nuevamente",
      sale: null,
    };
  }

  return {
    success: true,
    message: "Venta actualizada correctamente",
    sale: JSON.parse(JSON.stringify(data)),
  };
}

export async function getSale(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sales")
    .select("*, profile:profile(*)")
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      message: "Error al obtener la venta, intente nuevamente",
      sale: null,
    };
  }

  return {
    success: true,
    message: "Venta encontrada",
    sale: JSON.parse(JSON.stringify(data)),
  };
}

export const createSale = async (payload: FormData) => {
  const supabase = await createClient();
  const formData = Object.fromEntries(payload.entries());
  const parsedProducts = JSON.parse(formData.products as string);
  const parsedPayer = formData.payer
    ? JSON.parse(formData.payer as string)
    : null;
  const { data, error } = await supabase
    .from("sales")
    .insert({
      account_id: formData.accountId,
      total: formData.total,
      status: formData.status,
      status_detail: formData.statusDetail,
      delivered: formData.delivered,
      products: parsedProducts,
      transaction_id: formData.transactionId,
      date_created: formData.dateCreated,
      date_approved: formData.dateApproved,
      payment_methodId: formData.paymentMethodId,
      collector_id: formData.collector_id,
      payer: parsedPayer,
      order: generateRandomNumber(12),
    })
    .select()
    .single();
  if (error) {
    console.error("Error creating sale:", error);
    return {
      success: false,
      message: "Error al crear la venta, intente nuevamente",
      sale: null,
    };
  }
  return {
    success: true,
    message: "Venta creada correctamente",
    sale: JSON.parse(JSON.stringify(data)),
  };
};
