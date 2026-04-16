import { DPicture } from "@/models/DownloabledPicture";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

function DownloabledPicture({ picture }: { picture: DPicture }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (picture: DPicture) => {
    if (!picture.url) {
      toast.error("No hay URL disponible para descargar");
      return;
    }
    setDownloadingId(picture._id);
    try {
      // Opción 1: Usar fetch para obtener la imagen como blob
      const response = await fetch(picture.url);
      const blob = await response.blob();
      // Crear URL temporal del blob
      const blobUrl = window.URL.createObjectURL(blob);
      // Crear elemento anchor para descargar
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = picture.fileName; // Usar el nombre original del archivo
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`Descargando: ${picture.fileName}`);
    } catch (error) {
      console.error("Error al descargar:", error);
      toast.error("Error al descargar la imagen");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div key={picture._id} className="border rounded-lg p-4 shadow-sm">
      {picture.url ? (
        <div className="relative w-full h-48 mb-2">
          <Image
            src={picture.url}
            alt={picture.fileName}
            fill
            className="object-cover rounded"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
          <span className="text-gray-500">Sin imagen</span>
        </div>
      )}
      <p className="font-medium truncate">{picture.fileName}</p>
      <div className="flex gap-2 mt-3 justify-center">
        {picture.url && (
          <button
            onClick={() => handleDownload(picture)}
            disabled={downloadingId === picture._id}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {downloadingId === picture._id ? "Descargando..." : "Descargar"}
          </button>
        )}
      </div>
    </div>
  );
}

export default DownloabledPicture;
