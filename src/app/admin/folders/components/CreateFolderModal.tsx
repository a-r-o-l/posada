"use client";
import LoadingButton from "@/components/LoadingButton";
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
import { IGrade } from "@/models/Grade";
import { createFolder, updateFolder } from "@/server/folderAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import GradeSelect from "./GradeSelect";
import { IFolder } from "@/models/Folder";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  title: string;
  description: string;
  password: string;
  year: string;
  level: string;
};

const initialValues = {
  title: "",
  description: "",
  costPrice: "",
  password: "",
  year: new Date().getFullYear().toString(),
  level: "jardin",
};

const levels = [
  { value: "jardin", label: "Jardin" },
  { value: "primaria", label: "Primaria" },
  { value: "secundaria", label: "Secundaria" },
  { value: "eventos", label: "Eventos" },
];

function CreateFolderModal({
  type = "parent",
  schoolId = "",
  btnTitle = "Crear carpeta",
  modalTitle = "Crear carpeta",
  modalDescription = "Rellena los campos para crear una carpeta",
  open,
  onClose,
  parentFolder,
  grades,
  folder = null,
}: {
  type?: "child" | "parent";
  schoolId?: string;
  btnTitle?: string;
  modalTitle?: string;
  modalDescription?: string;
  open: boolean;
  parentFolder?: string;
  onClose: () => void;
  grades: IGrade[];
  folder?: IFolder | null;
}) {
  const [loading, setLoading] = useState(false);
  const [withPassword, setWithPassword] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [gradeState, setGradeState] = useState<string[]>([]);

  useEffect(() => {
    if (folder) {
      setValues({
        title: folder.title,
        description: folder.description || "",
        password: folder.password || "",
        year: folder.year || new Date().getFullYear().toString(),
        level: folder.level || "jardin",
      });
      setIsPrivate(folder.isPrivate!);
      setGradeState(folder?.grades?.map((grade) => grade as string) || []);
    }
  }, [open, folder]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPrivate && !gradeState.length) {
      toast.error("Seleccione al menos un grado");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append("type", type);
      if (parentFolder) {
        formData.append("parentFolder", parentFolder);
      }
      if (schoolId) {
        formData.append("schoolId", schoolId);
      }
      if (isPrivate) {
        const arrGrades = grades.filter((grade) =>
          gradeState.includes(grade._id)
        );
        formData.append("grades", JSON.stringify(arrGrades));
      }
      formData.append("isPrivate", isPrivate.toString());
      const response = folder
        ? await updateFolder(folder._id, formData)
        : await createFolder(formData);
      if (response.success) {
        toast.success(response.message);
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
      setWithPassword(false);
      setGradeState([]);
      setIsPrivate(false);
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
            <div className="space-y-2">
              <Label htmlFor="title">Nivel</Label>
              <Select
                defaultValue="jardin"
                value={values.level}
                onValueChange={(e) => setValues({ ...values, level: e })}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              <Label htmlFor="description">Año</Label>
              <Input
                type="text"
                id="year"
                value={values.year}
                onChange={(e) => setValues({ ...values, year: e.target.value })}
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
            <div className="flex items-center gap-2 mt-5">
              <Label>Privada</Label>
              <Checkbox
                checked={isPrivate}
                onCheckedChange={(e: boolean) => {
                  setGradeState([]);
                  setIsPrivate(e);
                }}
              />
            </div>
            <GradeSelect
              disabled={!isPrivate}
              grades={grades}
              state={gradeState}
              setState={setGradeState}
            />
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
