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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IGrade } from "@/models/Grade";
import { PartialSchool } from "@/models/School";
import { createGrade, updateGrade } from "@/server/gradeAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const initialValues = {
  grade: "",
  division: "jardin",
  year: new Date().getFullYear().toString(),
};

function GradeModal({
  open,
  onClose,
  school,
  editGrade,
}: {
  open: boolean;
  onClose: () => void;
  school?: PartialSchool | null;
  editGrade: IGrade | null;
}) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async () => {
    setLoading(true);
    if (!school?._id) {
      return;
    }
    try {
      if (editGrade) {
        const formData = new FormData();
        formData.append("grade", values.grade);
        formData.append("division", values.division);
        formData.append("displayName", `${values.grade} ${values.division}`);
        formData.append("year", values.year);
        const res = await updateGrade(formData, editGrade._id);
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
        formData.append("grade", values.grade);
        formData.append("division", values.division);
        formData.append("year", values.year);
        formData.append("displayName", `${values.grade} ${values.division}`);
        formData.append("schoolId", school._id);
        const res = await createGrade(formData);
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
    if (editGrade) {
      setValues({
        grade: editGrade.grade,
        division: editGrade.division,
        year: editGrade.year.toString(),
      });
    }
  }, [open, editGrade]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{!!editGrade ? "Editar" : "Crear"} Curso</DialogTitle>
          <DialogDescription>colegio: {school?.name}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label>Curso</Label>
            <Input
              value={values.grade}
              onChange={(e) => setValues({ ...values, grade: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Nivel</Label>
            <Select
              value={values.division}
              onValueChange={(e) => setValues({ ...values, division: e })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jardin">Jardin</SelectItem>
                <SelectItem value="primaria">Primaria</SelectItem>
                <SelectItem value="secundaria">Secundaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              value={values.year}
              onChange={(e) => setValues({ ...values, year: e.target.value })}
            />
          </div>
        </div>

        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title={!!editGrade ? "Guardar" : "Crear"}
            loading={loading}
            onClick={handleSubmit}
            disabled={!values.grade || !values.division || !values.year}
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

export default GradeModal;
