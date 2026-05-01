import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { Product } from "@/supabase/models/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener colegios",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsBySchoolId = async (schoolId: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("products")
        .select("*")
        .eq("school_id", schoolId)
        .order("name", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener colegios",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener colegio");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const isDownloadableValue = formData.get("is_downloadable") as string;
      const isDownloadable = isDownloadableValue === "true";
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          price: Number(formData.get("price")),
          school_id: formData.get("school_id") as string,
          is_downloadable: isDownloadable,
        })
        .select()
        .single();
      if (error) throw error;
      return { success: true, message: "Producto creado correctamente", data };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el producto",
      );
      return {
        success: false,
        message: error || "Error desconocido",
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const isDownloadableValue = formData.get("is_downloadable") as string;
      const isDownloadable = isDownloadableValue === "true";
      const { data, error } = await supabase
        .from("products")
        .update({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          price: Number(formData.get("price")),
          is_downloadable: isDownloadable,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return {
        success: true,
        message: "Producto actualizado correctamente",
        data,
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el producto",
      );
      return {
        success: false,
        message: error || "Error desconocido",
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return { success: true, message: "Producto eliminado correctamente" };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar el producto",
      );
      return {
        success: false,
        message: error || "Error desconocido",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    fetchProductsBySchoolId,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
