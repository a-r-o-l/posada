"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";

function ImageViewer({
  setFile,
  file,
  imageUrl = "",
  classname = "",
}: {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
  imageUrl?: string;
  classname?: string;
}) {
  const imgSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }
    if (file) {
      return URL.createObjectURL(file);
    } else {
      return null;
    }
  }, [file, imageUrl]);

  return (
    <div
      className={`relative border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden ${classname}`}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt="Product preview"
          className="w-full h-full object-cover"
          width={100}
          height={100}
        />
      ) : (
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">No hay imagen</p>
        </div>
      )}
      {imgSrc ? (
        <Button
          className="absolute bottom-2 right-2 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100"
          onClick={() => setFile(null)}
        >
          <X className="h-6 w-6 text-gray-600" />
        </Button>
      ) : (
        <>
          <Label
            htmlFor="product-image"
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100"
          >
            <Camera className="h-6 w-6 text-gray-600" />
          </Label>
          <Input
            id="product-image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </>
      )}
    </div>
  );
}

export default ImageViewer;
