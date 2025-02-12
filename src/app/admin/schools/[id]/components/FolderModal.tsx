"use client";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IFolder } from "@/models/Folder";
import React, { useEffect, useState } from "react";

const initialValues = {
  title: "",
  description: "",
  password: "",
  isPrivate: false,
};

function FolderModal({
  open,
  onClose,
  folder,
  type,
}: {
  open: boolean;
  onClose: () => void;
  folder?: IFolder | null;
  type: "edit" | "view";
}) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (folder && open) {
      setValues({
        title: folder?.title,
        description: folder?.description || "",
        password: folder?.password || "",
        isPrivate: folder?.isPrivate || false,
      });
    } else {
      setValues(initialValues);
    }
  }, [folder, open]);

  const typeIsEdit = type === "edit";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {typeIsEdit ? "Editar carpeta" : "Detalles de la carpeta"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label>Titulo</Label>
            {typeIsEdit ? (
              <Input
                value={values.title}
                onChange={({ target }) =>
                  setValues({ ...values, title: target.value })
                }
              />
            ) : (
              <div className="rounded-md w-full p-2 border">
                <p>{values.title}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Descripcion</Label>
            {typeIsEdit ? (
              <Textarea
                value={values.description}
                onChange={({ target }) =>
                  setValues({ ...values, description: target.value })
                }
              />
            ) : (
              <div className="rounded-md w-full p-2 border">
                <p>{values.description}</p>
              </div>
            )}
          </div>
          {typeIsEdit && (
            <div className="flex items-center gap-5">
              <Label>Carpeta con contraseña</Label>
              <Checkbox
                checked={values.isPrivate}
                onCheckedChange={(checked: boolean) =>
                  setValues({ ...values, isPrivate: checked })
                }
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Contraseña</Label>
            {typeIsEdit ? (
              <PasswordInput
                disabled={!values.isPrivate}
                value={values.password}
                onChange={({ target }) =>
                  setValues({ ...values, password: target.value })
                }
              />
            ) : (
              <div className="rounded-md w-full p-2 border">
                <p>{values.password}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-10 w-full">
          <div className="flex w-full justify-end items-center gap-5">
            {typeIsEdit && <Button className="w-40">Guardar</Button>}
            <Button onClick={onClose} className="w-40" variant="outline">
              {typeIsEdit ? "Cancelar" : "Cerrar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FolderModal;
