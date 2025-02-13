"use client";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { IFolder } from "@/models/Folder";
import { createManyFiles } from "@/server/fileAction";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageInfo {
  id: string;
  file: File;
  name: string;
  title: string;
  description: string;
  price: string;
}

function FileCreateModal({
  open,
  onClose,
  folder,
}: {
  open: boolean;
  onClose: () => void;
  folder?: IFolder;
}) {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    simulateProgress();
    const files = Array.from(e.target.files || []);
    const newImages = await Promise.all(
      files.map(async (file) => {
        const image = await processFile(file);
        return image;
      })
    );
    setImages((prev) => [...prev, ...newImages]);
  };

  const simulateProgress = () => {
    setProcessing(true); // Iniciar el estado de carga
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      if (progressValue >= 100) {
        clearInterval(interval);
        setProcessing(false); // Finalizar el estado de carga
        setProgress(0); // Reiniciar el progreso
      }
    }, 100);
  };

  const processFile = async (file: File): Promise<ImageInfo> => {
    const watermarkedFile = await applyWatermark(file);
    return {
      id: Math.random().toString(36).slice(2, 11),
      name: file.name,
      title: file.name,
      description: "",
      price: "100",
      file: watermarkedFile,
    };
  };

  const applyWatermark = async (file: File): Promise<File> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not found");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Context not found");

    const img = new window.Image();
    const preview = await createImagePreview(file);
    img.src = preview;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const scaleFactor = 2;
    const width = img.width / scaleFactor;
    const height = img.height / scaleFactor;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const fontSize = 150;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.fillText(file.name, 0, 0);
    ctx.restore();

    const watermarkedPreview = canvas.toDataURL("image/jpeg");
    const response = await fetch(watermarkedPreview);
    const blob = await response.blob();
    return new File([blob], file.name, { type: "image/jpeg" });
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!!images?.length) {
      const formData = new FormData();

      images.forEach((file, index) => {
        console.log("filecreateModal -> ", file);
        formData.append(`file${index}`, file.file);
      });

      formData.append("folder", "posada");

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        console.log("response -> ", response);

        if (response.ok) {
          const result = await response.json();
          console.log("Files uploaded successfully", result);

          const updatedImages = images.map((image, index) => ({
            ...image,
            imageUrl: result.imageUrls[index],
          }));

          const filesData = updatedImages.map((image) => ({
            fileName: image.name,
            title: image.title,
            description: image.description,
            price: image.price,
            folderId: folder?._id || "",
            imageUrl: image.imageUrl!,
          }));

          const createFilesResponse = await createManyFiles(
            filesData,
            folder?._id || ""
          );

          if (createFilesResponse.success) {
            toast.success(createFilesResponse.message);
            onClose();
          } else {
            console.error("File creation failed");
            toast.error(createFilesResponse.message);
          }
        } else {
          console.error("File upload failed", await response.text());
          toast.error("Error al subir los archivos");
        }
      } catch (error) {
        console.error("Error uploading files", error);
        toast.error("Error al subir los archivos");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setImages([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir archivos</DialogTitle>
          <DialogDescription>carpeta: {folder?.title}</DialogDescription>
        </DialogHeader>
        <div className="w-full flex items-center justify-center flex-wrap gap-5 max-h-96 overflow-y-auto mt-10">
          {processing ? (
            <div className="w-full flex flex-col items-center justify-center">
              <span className="text-gray-600 mb-2">Cargando imágenes...</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <Progress value={progress} />
              </div>
            </div>
          ) : !images.length ? (
            <div className="w-full flex items-center justify-center">
              <Label
                className="flex flex-col items-center justify-end w-60 text-center cursor-pointer"
                htmlFor="image-upload"
              >
                <div className="rounded-full items-center flex justify-center border w-12 h-12 hover:opacity-60">
                  <Upload size={18} />
                </div>
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Haga clic para seleccionar imágenes o arrastre y suelte aquí
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
          ) : (
            images.map((img) => (
              <Card key={img.id} className="w-28">
                <div className="flex w-full justify-end gap-5">
                  <Button
                    className="rounded-full w-6 h-6"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setImages((prev) =>
                        prev.filter((image) => image.id !== img.id)
                      )
                    }
                  >
                    <X />
                  </Button>
                </div>
                <CardContent className="flex justify-center items-center">
                  <div>
                    <Image
                      src={URL.createObjectURL(img.file)}
                      alt={img.name}
                      className="object-center rounded"
                      width={100}
                      height={100}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title="Guardar"
            loading={loading}
            disabled={!images.length || processing}
            onClick={handleSubmit}
            classname="w-40"
          />
          <Button variant="outline" className="w-40" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileCreateModal;
