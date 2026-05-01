import { createClient } from "@/supabase/server";

export async function getProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase.from("products").select("*");

  if (error) throw new Error(error.message);

  return products;
}

export const getProductsBySchoolId = async (schoolId: string) => {
  if (!schoolId) return { data: [] };
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("school_id", schoolId);
  if (error) throw new Error(error.message);
  return { data: products };
};

export async function getProduct(id: string) {
  const supabase = await createClient();

  const { data: school, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return { school };
}
