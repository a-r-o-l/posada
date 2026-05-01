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
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import GradeSelect from "./GradeSelect";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grade } from "@/supabase/models/grade";
import { Folder } from "@/supabase/models/folder";
import { useFolders } from "@/supabase/hooks/client/useFolders";

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
  grades: Grade[];
  folder?: Folder | null;
}) {
  const { createFolder, updateFolder } = useFolders();
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
      setIsPrivate(folder.is_private!);
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
      let payload = {};
      payload = { ...payload, type: type };

      if (parentFolder) {
        payload = { ...payload, parent_folder: parentFolder };
      }
      if (schoolId) {
        payload = { ...payload, school_id: schoolId };
      }
      if (isPrivate) {
        const arrGrades = grades.filter((grade) =>
          gradeState.includes(grade.id),
        );
        payload = { ...payload, grades: arrGrades };
      }
      payload = { ...payload, is_private: isPrivate };
      payload = { ...payload, ...values };
      // IMPORTANTE: Usar await correctamente
      const response = folder
        ? await updateFolder(folder.id, payload)
        : await createFolder(payload);

      if (response.success) {
        toast.success(response.message);
        onClose();
      } else {
        toast.error(response.message);
        console.error("Error:", response.message);
      }
    } catch (error) {
      toast.error("Error del servidor, intente nuevamente");
      console.error(error);
    } finally {
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

  const filteredGrades = useMemo(() => {
    if (!grades || !grades.length || !values.year) return [];
    const filtered = grades.filter((grade) => {
      const year = grade.year;
      return year === values.year;
    });
    return filtered;
  }, [grades, values.year]);

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
              <Label>Carpeta privada</Label>
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
              grades={filteredGrades}
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
