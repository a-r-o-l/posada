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
import { FolderFullDetails } from "@/supabase/models/folder";
import { createManyFilesSpb, delay } from "@/supabase/storage";
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
  watermarkedFile?: File;
}

function FileCreateModal({
  open,
  onClose,
  folder,
}: {
  open: boolean;
  onClose: () => void;
  folder?: FolderFullDetails;
}) {
  // const { fetchSchool, school } = useSchools();
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProcessing(true);
    setProgress(0);

    const newImages: ImageInfo[] = [];

    // Procesar secuencialmente para no saturar cliente
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const image = await processFile(file);
      newImages.push(image);
      setProgress(((i + 1) / files.length) * 100);

      // Pequeño delay entre procesamientos
      if (i % 5 === 0) await delay(100);
    }

    setImages((prev) => [...prev, ...newImages]);
    setProcessing(false);
    setProgress(0);
  };

  // const simulateProgress = () => {
  //   setProcessing(true);
  //   let progressValue = 0;
  //   const interval = setInterval(() => {
  //     progressValue += 10;
  //     setProgress(progressValue);
  //     if (progressValue >= 100) {
  //       clearInterval(interval);
  //       setProcessing(false);
  //       setProgress(0);
  //     }
  //   }, 100);
  // };

  const processFile = async (file: File): Promise<ImageInfo> => {
    const watermarkedFile = await applyWatermark(file);
    return {
      id: Math.random().toString(36).slice(2, 11),
      name: file.name,
      title: file.name,
      description: "",
      price: "100",
      file: file,
      watermarkedFile,
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

    const scaleFactor = 4;
    const width = img.width / scaleFactor;
    const height = img.height / scaleFactor;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    let text = file.name;
    if (text.length > 30) text = text.slice(0, 27) + "...";

    const fontSize = Math.max(20, Math.min(width / 6, 40));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Repetir el texto en una grilla cubriendo toda la imagen
    const stepX = width / 2;
    const stepY = height / 3;

    for (let x = stepX / 2; x < width; x += stepX) {
      for (let y = stepY / 2; y < height; y += stepY) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((-30 * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }

    const watermarkedPreview = canvas.toDataURL("image/jpeg", 0.5);
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

  const submit = async () => {
    if (!images.length) return;

    setLoading(true);

    try {
      // Mostrar progreso en tiempo real
      toast.info(`Subiendo ${images.length} imágenes...`, { duration: 3000 });

      const result = await createManyFilesSpb(
        images.map((img) => ({
          fileName: img.name,
          title: img.title,
          description: img.description,
          price: img.price,
          folderId: folder?.id || "",
          imageFile: img.file,
          watermarkedFile: img.watermarkedFile,
        })),
        folder?.id || "",
        (current, total) => {
          // Actualizar progreso
          setProgress((current / total) * 100);
          if (current % 5 === 0) {
            toast.info(`Subiendo imágenes: ${current}/${total}`, {
              duration: 1000,
            });
          }
        },
      );

      if (result.success) {
        toast.success(
          `✅ ${result.files?.length || 0} archivos subidos correctamente`,
        );
        if (result.errors?.length) {
          toast.warning(`⚠️ ${result.errors.length} archivos fallaron`);
          console.error("Errores:", result.errors);
        }
        onClose();
      } else {
        toast.error(result.message || "Error al subir los archivos");
        if (result.errors) {
          console.error("Detalles de errores:", result.errors);
        }
      }
    } catch (error) {
      console.error("Error en submit:", error);
      toast.error("Error inesperado al subir archivos");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // useEffect(() => {
  //   if (folder) {
  //     fetchSchool(folder.school_id);
  //   }
  // }, [folder]);

  useEffect(() => {
    if (!open) {
      setImages([]);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (loading || processing) {
          return;
        }
        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir archivos awsd</DialogTitle>
          <DialogDescription className="flex flex-col">
            <span>carpeta: {folder?.title}</span>
            <span>cantidad: {images.length}</span>
          </DialogDescription>
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
                        prev.filter((image) => image.id !== img.id),
                      )
                    }
                  >
                    <X />
                  </Button>
                </div>
                <CardContent className="flex justify-center items-center">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(img);
                    }}
                  >
                    <Image
                      src={URL.createObjectURL(img.watermarkedFile || img.file)}
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
          {processing && (
            <div className="w-full flex flex-col items-center justify-center p-4">
              <span className="text-gray-600 mb-2">
                Procesando imágenes... {Math.round(progress)}%
              </span>
              <Progress value={progress} className="w-full" />
              <span className="text-xs text-gray-400 mt-2">
                Esto puede tomar unos minutos para muchas imágenes
              </span>
            </div>
          )}

          {loading && !processing && (
            <div className="w-full flex flex-col items-center justify-center p-4">
              <span className="text-gray-600 mb-2">
                Subiendo a servidor... {Math.round(progress)}%
              </span>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>
        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title="Guardar"
            loading={loading}
            disabled={!images.length || processing}
            onClick={submit}
            classname="w-40"
          />
          <Button
            variant="outline"
            className="w-40"
            onClick={() => {
              if (loading || processing) {
                return;
              }
              onClose();
            }}
            disabled={loading || processing}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileCreateModal;
