"use client";

import { DigitalDownload } from "@/supabase/models/digital_downloads";
import { Download, Lock, Image as ImageIcon, CheckCircle } from "lucide-react";
import Image from "next/image";

interface DigitalDownloadsGridProps {
  download: DigitalDownload;
  handleDownload: (download: DigitalDownload) => Promise<void>;
}

export function DigitalDownloadsGrid({
  download,
  handleDownload,
}: DigitalDownloadsGridProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:cursor-pointer">
      {/* Contenedor de la imagen - sin interacción */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {download?.url ? (
          <div
            className="relative w-full h-full"
            onContextMenu={(e) => e.preventDefault()} // Bloquear click derecho
            onDragStart={(e) => e.preventDefault()} // Bloquear arrastre
          >
            <Image
              src={download?.url}
              alt={download?.file_name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              unoptimized // Si las imágenes son de Supabase Storage
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-300" />
          </div>
        )}

        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          {download?.status === "approved" ? (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <CheckCircle size={12} />
              Disponible
            </div>
          ) : (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <Lock size={12} />
              Pendiente
            </div>
          )}
        </div>
      </div>

      {/* Información y botón */}
      <div className="p-4">
        <h3
          className="text-sm font-semibold text-gray-800 truncate mb-2"
          title={download?.file_name}
        >
          {download?.file_name}
        </h3>
        <button
          onClick={() => handleDownload(download)}
          disabled={download?.status !== "approved"}
          className={`
                w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                flex items-center justify-center gap-2
                ${
                  download?.status === "approved"
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
        >
          <Download size={16} />
          {download?.status === "approved" ? "Descargar" : "No disponible"}
        </button>
      </div>
    </div>
  );
}
