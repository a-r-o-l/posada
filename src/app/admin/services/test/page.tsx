"use client";
import React, { useState, useEffect } from "react";
import { uploadFile } from "@/supabase/storage";
import { createDP, getDPByAccountId } from "@/server/downloabledPictureAction";
import { toast } from "sonner";
import WatemarkImage from "@/components/WatemarkImage";
import { DPicture } from "@/models/DownloabledPicture";
// import DownloabledPicture from "@/components/DownloabledPicture";

// Hardcodear estos valores
const ACCOUNT_ID = "67a55e5d2e5a064489ace1b0";
const FILE_ID = "680594f0c6821f3043cb8ce2";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pictures, setPictures] = useState<DPicture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar las imágenes al montar el componente
  useEffect(() => {
    loadPictures();
  }, []);

  const loadPictures = async () => {
    setIsLoading(true);
    try {
      const result = await getDPByAccountId(ACCOUNT_ID);
      if (result.success && result.data) {
        setPictures(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error loading pictures:", error);
      toast.error("Error al cargar las imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Por favor, selecciona un archivo");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Subir la imagen a Supabase
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `downloadable/${ACCOUNT_ID}/${fileName}`;

      const uploadResult = await uploadFile(selectedFile, filePath);

      if (!uploadResult.success) {
        toast.error(`Error al subir la imagen: ${uploadResult.error}`);
        return;
      }

      // 2. Crear el documento en MongoDB
      const formData = new FormData();
      formData.append("fileName", selectedFile.name);
      formData.append("url", uploadResult.url || "");
      formData.append("accountId", ACCOUNT_ID);
      formData.append("fileId", FILE_ID);

      const createResult = await createDP(formData);

      if (!createResult.success) {
        toast.error(
          `Error al guardar en la base de datos: ${createResult.message}`,
        );
        return;
      }

      toast.success("Imagen subida correctamente");

      // 3. Limpiar el input y recargar la lista
      setSelectedFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
      await loadPictures();
    } catch (error) {
      console.error("Error en el proceso:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Subir imágenes descargables</h1>

      {/* Formulario de subida */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 border rounded-lg"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="file" className="font-medium">
            Seleccionar imagen
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded"
            disabled={isUploading}
          />
          {selectedFile && (
            <p className="text-sm text-gray-600">
              Archivo seleccionado: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUploading ? "Subiendo..." : "Subir imagen"}
        </button>
      </form>

      {/* Lista de imágenes */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Imágenes disponibles</h2>

        {isLoading ? (
          <p>Cargando imágenes...</p>
        ) : pictures.length === 0 ? (
          <p className="text-gray-500">No hay imágenes disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pictures.map((picture) => (
              <WatemarkImage
                key={picture?._id}
                fileName={picture.fileName}
                url={picture.url}
              />
              // <DownloabledPicture key={picture.id} picture={picture} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
