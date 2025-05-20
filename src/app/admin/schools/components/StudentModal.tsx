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
import { PartialSchool } from "@/models/School";
import { IStudentWP } from "@/models/Student";
import { createStudent, updateStudent } from "@/server/studentAction";
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
  editStudent,
}: {
  open: boolean;
  onClose: () => void;
  school?: PartialSchool | null;
  grade?: string;
  editStudent?: IStudentWP | null;
}) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async () => {
    setLoading(true);
    if (!school?._id || !grade) {
      return;
    }
    try {
      if (editStudent) {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("lastname", values.lastname);
        formData.append("displayName", `${values.lastname} ${values.name}`);
        const res = await updateStudent(editStudent._id, formData);
        if (res.success) {
          toast.success(res.message);
          setLoading(false);
          onClose();
        } else {
          toast.error(res.message);
          setLoading(false);
        }
      } else {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("lastname", values.lastname);
        formData.append("displayName", `${values.lastname} ${values.name}`);
        formData.append("schoolId", school._id);
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
    if (editStudent) {
      setValues({
        name: editStudent.name,
        lastname: editStudent.lastname,
      });
    }
  }, [open, editStudent]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{!!editStudent ? "Editar" : "Crear"} alumno</DialogTitle>
          <DialogDescription>colegio: {school?.name}</DialogDescription>
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
            title={!!editStudent ? "Guardar" : "Crear"}
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
