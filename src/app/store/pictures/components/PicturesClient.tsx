"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDigitalDownloads } from "@/supabase/hooks/client/useDigitalDownloads";
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect } from "react";
import { DigitalDownloadsGrid } from "./PictureComponent";
import { DigitalDownload } from "@/supabase/models/digital_downloads";
import { Loader2 } from "lucide-react";

function PicturesClient() {
  const { currentUser } = useAuthStore();
  const { digitaldownloads, fetchDigitaldownloadsByAccountId, loading } =
    useDigitalDownloads();

  useEffect(() => {
    if (currentUser) {
      fetchDigitaldownloadsByAccountId(currentUser.id);
    }
  }, [currentUser]);

  const handleDownload = async (download: DigitalDownload) => {
    if (download.status !== "approved") return;

    try {
      const response = await fetch(download.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = download.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="p-3 md:p-6">
        <CardTitle className="text-sm md:text-base">Mis Fotos</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Descargas disponibles de tus fotos compradas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mt-5">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 h-60 justify-center items-center flex">
              <Loader2 className="animate-spin mx-auto" />
            </div>
          ) : (
            digitaldownloads.map((download) => (
              <DigitalDownloadsGrid
                download={download}
                key={download.id}
                handleDownload={handleDownload}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PicturesClient;
