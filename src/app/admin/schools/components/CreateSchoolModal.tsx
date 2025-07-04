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
import { PartialSchool } from "@/models/School";
import { createSchool, updateSchool } from "@/server/schoolAction";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FormValues = {
  name: string;
  description: string;
  password: string;
};

const initialValues = {
  name: "",
  description: "",
  password: "",
};

function CreateSchoolModal({
  open,
  onClose,
  editSchool,
}: {
  open: boolean;
  onClose: () => void;
  editSchool: PartialSchool | null;
}) {
  const [loading, setLoading] = useState(false);
  const [withPassword, setWithPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    let imageUrl = "";
    try {
      if (!!editSchool) {
        if (file) {
          const formDataImage = new FormData();
          formDataImage.append("file", file);
          formDataImage.append("folder", "school");
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
        } else {
          imageUrl = existingImage || "";
        }
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("password", withPassword ? values.password : "");
        formData.append("imageUrl", imageUrl);
        formData.append("isPrivate", withPassword ? "true" : "false");
        const response = await updateSchool(editSchool._id || "", formData);
        if (response.success) {
          toast.success("Colegio editado correctamente");
          onClose();
          setLoading(false);
        } else {
          toast.error(response.message);
          console.error("Error al editar el colegio:", response.message);
          setLoading(false);
        }
        return;
      }
      if (file) {
        const formDataImage = new FormData();
        formDataImage.append("file", file);
        formDataImage.append("folder", "school");
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
      formData.append("imageUrl", imageUrl);

      const response = await createSchool(formData);
      if (response.success) {
        toast.success("Colegio creado correctamente");
        onClose();
        setLoading(false);
      } else {
        toast.error(response.message);
        console.error("Error al crear el colegio:", response.message);
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
    } else {
      if (!!editSchool) {
        setValues({
          name: editSchool?.name || "",
          description: editSchool?.description || "",
          password: editSchool?.password || "",
        });
        setWithPassword(!!editSchool?.password);
        setExistingImage(editSchool?.imageUrl || null);
        if (editSchool.isPrivate) {
          setWithPassword(true);
        }
      }
    }
  }, [open, editSchool]);

  const disabledSubmit = useMemo(() => {
    if (editSchool) {
      if (!values.name) return true;
      if (
        values.name === editSchool?.name &&
        values.description === editSchool?.description &&
        values.password === editSchool?.password &&
        existingImage === editSchool?.imageUrl &&
        editSchool?.isPrivate === withPassword
      ) {
        return true;
      }
      return false;
    } else {
      if (!values.name) return true;
      return false;
    }
  }, [values, withPassword, editSchool, existingImage]);

  useEffect(() => {
    if (!withPassword) {
      if (values.password) {
        setValues({ ...values, password: "" });
      }
    }
  }, [withPassword, values]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editSchool ? "Editar" : "Crear"} un colegio
          </DialogTitle>
          <DialogDescription>
            Formulario para {editSchool ? "editar" : "crear"} un colegio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-5">
            <div className="flex justify-center">
              <ImageViewer
                file={file}
                setFile={setFile}
                imageUrl={existingImage}
                setExistingImage={setExistingImage}
                classname="w-1/2 min-h-40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                type="text"
                id="name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
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
              <Label>Colegio con contraseña</Label>
              <Checkbox
                checked={withPassword}
                onCheckedChange={(e) => setWithPassword(e as boolean)}
              />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-end gap-5">
            <LoadingButton
              title={editSchool ? "Guardar" : "Crear"}
              classname="w-40"
              loading={loading}
              type="submit"
              disabled={disabledSubmit}
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

export default CreateSchoolModal;
