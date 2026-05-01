import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { SaleItemsFullDetails } from "@/supabase/models/sale_items";

export const useSaleItems = () => {
  const [saleItems, setSaleItems] = useState<SaleItemsFullDetails[]>([]);
  const [saleItem, setSaleItem] = useState<SaleItemsFullDetails | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSaleItemsBySaleId = async (id: string) => {
    try {
      setQueryLoading(true);
      setError(null);
      const query = supabase
        .from("sale_items")
        .select(
          `
    *,
    product:products!fk_sale_items_product(*, school:schools(*)),
    file:files(*, folder:folders(*, school:schools(*)))
  `,
        )
        .eq("sale_id", id);
      const { data, error } = await query;
      if (error) throw error;
      setSaleItems(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener los items de venta",
      );
    } finally {
      setQueryLoading(false);
    }
  };

  const createSaleItem = async (
    saleItem: Omit<SaleItemsFullDetails, "id" | "created_at">,
  ) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("sale_items")
        .insert(saleItem)
        .select("*")
        .single();
      if (error) {
        return { data: null, error, success: false };
      }
      return { data, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : "Error al crear el item de venta",
        success: false,
      };
    } finally {
      setMutationLoading(false);
    }
  };

  const updateSaleItem = async (
    id: string,
    saleItem: Partial<Omit<SaleItemsFullDetails, "id" | "created_at">>,
  ) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("sale_items")
        .update(saleItem)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      setSaleItem(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el item de venta",
      );
    } finally {
      setMutationLoading(false);
    }
  };

  return {
    saleItems,
    saleItem,
    queryLoading,
    mutationLoading,
    error,
    fetchSaleItemsBySaleId,
    createSaleItem,
    updateSaleItem,
  };
};
