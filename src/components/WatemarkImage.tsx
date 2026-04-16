import Image from "next/image";
import React from "react";

function WatemarkImage({ url, fileName }: { url?: string; fileName: string }) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm relative"
      onContextMenu={handleContextMenu}
    >
      <div className="relative w-full h-48 mb-2 overflow-hidden rounded group">
        {url ? (
          <>
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={fileName}
                fill
                className="object-cover"
                draggable={false}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
              <div className="transform -rotate-12 bg-black/70 text-white px-4 py-2 rounded-lg text-xl font-semibold backdrop-blur-sm opacity-50">
                {fileName}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default WatemarkImage;
