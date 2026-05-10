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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/supabase/hooks/client/useProducts";
import { Product } from "@/supabase/models/product";
import { School } from "@/supabase/models/school";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const initialValues = {
  name: "",
  description: "",
  price: "",
  isDownloadable: false,
  order: "1",
};

function ProductModal({
  open,
  onClose,
  school,
  product,
}: {
  open: boolean;
  onClose: () => void;
  school?: School;
  product: Product | null;
}) {
  const { createProduct, updateProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const router = useRouter();
  const handleSubmit = async () => {
    setLoading(true);
    if (!school) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("order", values.order);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("school_id", school.id);
      formData.append("is_downloadable", values.isDownloadable.toString());
      const res = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      if (res.success) {
        toast.success(res.message);
        setLoading(false);
        onClose();
        router.refresh();
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
        description: product?.description || "",
        price: product.price.toString(),
        isDownloadable: product.is_downloadable,
        order: !!product?.order ? product?.order?.toString() : "1",
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
            <Label>Orden</Label>
            <Input
              value={values.order}
              onChange={(e) => setValues({ ...values, order: e.target.value })}
            />
          </div>
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
          <div className="flex items-center gap-3">
            <Label>Es Descargable?</Label>
            <Switch
              checked={values.isDownloadable}
              onCheckedChange={(e) =>
                setValues({ ...values, isDownloadable: e })
              }
            />
            {/* <Checkbox
              checked={values.isDownloadable}
              onCheckedChange={(e) =>
                setValues({ ...values, isDownloadable: !!e })
              }
            /> */}
          </div>
        </div>

        <div className="flex w-full justify-evenly mt-10 gap-5">
          <LoadingButton
            title={product ? "Actualizar producto" : "Crear producto"}
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
