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
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:cursor-pointer w-60">
      {/* Contenedor de la imagen */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {download?.url ? (
          <div
            className="relative w-full h-full"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            <Image
              src={download?.url}
              alt={download?.file_name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-300" />
          </div>
        )}

        {/* Badge de estado */}
        <div className="absolute top-1.5 right-1.5">
          {download?.status === "approved" ? (
            <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5 shadow">
              <CheckCircle size={9} />
              Disponible
            </div>
          ) : (
            <div className="bg-yellow-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5 shadow">
              <Lock size={9} />
              Pendiente
            </div>
          )}
        </div>
      </div>

      {/* Información y botón */}
      <div className="p-2">
        <h3
          className="text-xs font-semibold text-gray-800 truncate mb-1.5"
          title={download?.file_name}
        >
          {download?.file_name}
        </h3>
        <button
          onClick={() => handleDownload(download)}
          disabled={download?.status !== "approved"}
          className={`
            w-full py-1.5 rounded-md font-medium text-xs transition-all duration-200
            flex items-center justify-center gap-1
            ${
              download?.status === "approved"
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <Download size={12} />
          {download?.status === "approved" ? "Descargar" : "No disponible"}
        </button>
      </div>
    </div>
  );
}
