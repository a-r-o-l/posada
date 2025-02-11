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
import { Textarea } from "@/components/ui/textarea";
import { IProduct } from "@/models/Product";
import { ISchool } from "@/models/School";
import { createProduct, updateProduct } from "@/server/productAction";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const initialValues = {
  name: "",
  description: "",
  price: "",
};

function ProductModal({
  open,
  onClose,
  school,
  product,
}: {
  open: boolean;
  onClose: () => void;
  school?: ISchool;
  product: IProduct | null;
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
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("schoolId", school._id);
      const res = product
        ? await updateProduct(product._id, formData)
        : await createProduct(formData);
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
    if (product && open) {
      setValues({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
      });
    } else {
      setValues(initialValues);
    }
    if (!open) {
      setValues(initialValues);
    }
  }, [open, product]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
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
            <Label>Precio</Label>
            <Input
              value={values.price}
              onChange={(e) => setValues({ ...values, price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title="Crear"
            loading={loading}
            onClick={handleSubmit}
            disabled={!values.name || !values.price}
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

export default ProductModal;
