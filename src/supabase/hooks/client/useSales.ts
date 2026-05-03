import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { SaleFullDetails } from "@/supabase/models/sale";

export const useSales = () => {
  const [sales, setSales] = useState<SaleFullDetails[]>([]);
  const [sale, setSale] = useState<SaleFullDetails | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSaleItemsByAccountId = async (id: string) => {
    try {
      setQueryLoading(true);
      setError(null);
      const query = supabase.from("sales").select("*").eq("account_id", id);
      const { data, error } = await query;
      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener las ventas",
      );
    } finally {
      setQueryLoading(false);
    }
  };

  const fetchSalesByDate = async (
    start: string,
    end: string,
    state: string,
  ) => {
    try {
      setQueryLoading(true);
      setError(null);
      let query = supabase.from("sales").select("*, profile:profile(*)");
      if (start) {
        query = query.gte("date_created::date", start);
      }
      if (end) {
        query = query.lte("date_created::date", end);
      }
      if (state && state !== "all") {
        query = query.eq("status", state);
      }
      const { data: sales, error } = await query.order("date_created", {
        ascending: false,
      });
      if (error) throw error;
      setSales(sales || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener las ventas",
      );
    } finally {
      setQueryLoading(false);
    }
  };

  const createSale = async (
    sale: Omit<SaleFullDetails, "id" | "created_at">,
  ) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("sales")
        .insert(sale)
        .select("*")
        .single();
      if (error) throw error;
      setSale(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la venta");
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteSale = async (id: string) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { error } = await supabase.from("sales").delete().eq("id", id);
      if (error) {
        return {
          success: false,
          error: error.message || "Error al eliminar la venta",
        };
      }

      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Error al eliminar la venta",
      };
    } finally {
      setMutationLoading(false);
    }
  };

  const updateSale = async (
    id: string,
    sale: Partial<Omit<SaleFullDetails, "id" | "created_at">>,
  ) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("sales")
        .update(sale)
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        return {
          success: false,
          data: null,
          error: error.message || "Error al actualizar la venta",
        };
      }
      return { success: true, data, error: null };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la venta",
      );
      return {
        success: false,
        data: null,
        error:
          err instanceof Error ? err.message : "Error al actualizar la venta",
      };
    } finally {
      setMutationLoading(false);
    }
  };

  const updateSaleStatus = async (id: string) => {
    try {
      setMutationLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("sales")
        .update({ status: "approved" })
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        return {
          success: false,
          data: null,
          error: error.message || "Error al actualizar el estado de la venta",
        };
      }
      return { success: true, data, error: null };
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el estado de la venta",
      );
      return {
        success: false,
        data: null,
        error:
          err instanceof Error
            ? err.message
            : "Error al actualizar el estado de la venta",
      };
    } finally {
      setMutationLoading(false);
    }
  };

  return {
    sales,
    sale,
    queryLoading,
    mutationLoading,
    error,
    fetchSaleItemsByAccountId,
    createSale,
    updateSale,
    deleteSale,
    updateSaleStatus,
    fetchSalesByDate,
  };
};
