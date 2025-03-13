"use client";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStudent } from "@/server/studentAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const initialValues = {
  name: "",
  lastname: "",
};

function StudentModal({
  open,
  onClose,
  school,
  grade,
}: {
  open: boolean;
  onClose: () => void;
  school?: string;
  grade?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async () => {
    setLoading(true);
    if (!school || !grade) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("lastname", values.lastname);
      formData.append("displayName", `${values.lastname} ${values.name}`);
      formData.append("schoolId", school);
      formData.append("gradeId", grade);
      const res = await createStudent(formData);
      if (res.success) {
        toast.success(res.message);
        setLoading(false);
        onClose();
      } else {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setValues(initialValues);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear alumno</DialogTitle>
          <DialogDescription>colegio:</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Apellido</Label>
            <Input
              value={values.lastname}
              onChange={(e) =>
                setValues({ ...values, lastname: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title="Crear"
            loading={loading}
            onClick={handleSubmit}
            disabled={!values.name || !values.lastname}
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

export default StudentModal;
