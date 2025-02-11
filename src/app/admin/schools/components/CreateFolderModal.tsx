"use client";
import ImageViewer from "@/components/ImageViewer";
import LoadingButton from "@/components/LoadingButton";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFolder } from "@/server/folderAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type FormValues = {
  title: string;
  description: string;
  password: string;
};

const initialValues = {
  title: "",
  description: "",
  costPrice: "",
  password: "",
};

function CreateFolderModal({
  type = "parent",
  schoolId = "",
  btnTitle = "Crear carpeta",
  modalTitle = "Crear carpeta",
  modalDescription = "Rellena los campos para crear una carpeta",
  open,
  onClose,
}: {
  type?: "child" | "parent";
  schoolId?: string;
  btnTitle?: string;
  modalTitle?: string;
  modalDescription?: string;
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [withPassword, setWithPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    let imageUrl = "";
    try {
      if (file) {
        const formDataImage = new FormData();
        formDataImage.append("file", file);
        formDataImage.append("folder", "posada");
        const response = await fetch("/api/upload/folderImage", {
          method: "POST",
          body: formDataImage,
        });
        if (response.ok) {
          const result = await response.json();
          imageUrl = result.imageUrl;
          console.log("File uploaded successfully", result);
        } else {
          console.error("File upload failed", await response.text());
        }
      }
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append("type", type);
      formData.append("schoolId", schoolId);
      formData.append("imageUrl", imageUrl);

      const response = await createFolder(formData);
      if (response.success) {
        toast.success("Carpeta creada correctamente");
        onClose();
        setLoading(false);
      } else {
        toast.error(response.message);
        console.error("Error al crear la carpeta:", response.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error del servidor, intente nuevamente");
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setValues(initialValues);
      setFile(null);
      setWithPassword(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-5">
            <div className="flex justify-center">
              <ImageViewer
                file={file}
                setFile={setFile}
                classname="w-1/2 min-h-40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titulo</Label>
              <Input
                type="text"
                id="title"
                value={values.title}
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                value={values.description}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <PasswordInput
                id="password"
                value={values.password}
                disabled={!withPassword}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-start gap-5 px-1">
              <Label>Carpeta con contraseña</Label>
              <Checkbox
                checked={withPassword}
                onCheckedChange={(e) => setWithPassword(e as boolean)}
              />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-end gap-5">
            <LoadingButton
              title={btnTitle}
              classname="w-40"
              loading={loading}
              type="submit"
              disabled={!values.title || (withPassword && !values.password)}
            />

            <Button
              type="button"
              className="w-40"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFolderModal;
