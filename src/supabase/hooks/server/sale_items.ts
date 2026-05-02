import { createClient } from "@/supabase/server";
import { supabaseAdmin } from "@/supabase/supabase";
// import { serverUploadFile } from "@/supabase/serverStorage";

export const getSaleItemsBySaleId = async (
  saleId: string,
  useAdmin = false,
) => {
  const supabase = useAdmin ? supabaseAdmin : await createClient();
  const { data, error } = await supabase
    .from("sale_items")
    .select("*")
    .eq("sale_id", saleId);

  if (error) {
    console.error("Error fetching sale items by sale ID:", error);
    return { data: [], error: error.message };
  }

  return { data: data || [], error: null };
};
