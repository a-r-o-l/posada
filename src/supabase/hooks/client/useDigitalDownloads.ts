import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { DigitalDownloadFullDetails } from "@/supabase/models/digital_downloads";

export const useDigitalDownloads = () => {
  const [digitaldownloads, setDigitaldownloads] = useState<
    DigitalDownloadFullDetails[]
  >([]);
  const [digitaldownload, setDigitaldownload] =
    useState<DigitalDownloadFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDigitaldownloads = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase.from("digital_downloads").select("*");
      const { data, error } = await query;
      if (error) throw error;
      setDigitaldownloads(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener archivos",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDigitaldownloadsByAccountId = async (accountId: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("digital_downloads")
        .select("*")
        .eq("account_id", accountId);
      const { data, error } = await query;
      if (error) throw error;
      setDigitaldownloads(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener archivos por carpeta",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDigitaldownloadsBySaleId = async (saleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = supabase
        .from("digital_downloads")
        .select("*, file:files(*), sale:sales(*)")
        .eq("sale_id", saleId);
      const { data, error } = await query;
      if (error) throw error;
      setDigitaldownloads(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al obtener archivos por carpeta",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    digitaldownloads,
    digitaldownload,
    loading,
    error,
    fetchDigitaldownloads,
    fetchDigitaldownloadsByAccountId,
    fetchDigitaldownloadsBySaleId,
  };
};
