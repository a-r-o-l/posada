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
import { Grade } from "@/supabase/models/grade";
import { School } from "@/supabase/models/school";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGrades } from "@/supabase/hooks/client/useGrades";

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
  school?: School | null;
  editGrade: Grade | null;
}) {
  const { createGrade, updateGrade } = useGrades();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async () => {
    setLoading(true);
    if (!school?.id) {
      return;
    }
    try {
      if (editGrade) {
        const formData = new FormData();
        formData.append("grade", values.grade);
        formData.append("division", values.division);
        formData.append("display_name", `${values.grade} ${values.division}`);
        formData.append("year", values.year);
        const res = await updateGrade(formData, editGrade.id);
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
        formData.append("display_name", `${values.grade} ${values.division}`);
        formData.append("school_id", school.id);
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
        year:
          editGrade?.year?.toString() || new Date().getFullYear().toString(),
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
