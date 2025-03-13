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
import { createGrade } from "@/server/gradeAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const initialValues = {
  grade: "",
  division: "",
};

function StudentModal({
  open,
  onClose,
  school,
}: {
  open: boolean;
  onClose: () => void;
  school?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);

  const handleSubmit = async () => {
    setLoading(true);
    if (!school) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("grade", values.grade);
      formData.append("division", values.division);
      formData.append("displayName", `${values.grade} ${values.division}`);
      formData.append("schoolId", school);
      const res = await createGrade(formData);
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
          <DialogTitle>Crear producto</DialogTitle>
          <DialogDescription>colegio: </DialogDescription>
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
            <Label>Division</Label>
            <Input
              value={values.division}
              onChange={(e) =>
                setValues({ ...values, division: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title="Crear"
            loading={loading}
            onClick={handleSubmit}
            disabled={!values.grade || !values.division}
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
