"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MercadoPago from "@/icons/mpsvg";
import { ISalePopulated } from "@/models/Sale";
import { getPaymentLink } from "@/server/mpAction";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function PaymentModal({
  open,
  onClose,
  sale,
}: {
  open: boolean;
  onClose: () => void;
  sale: ISalePopulated | null;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagar</DialogTitle>
          <DialogDescription>Seleccione el metodo de pago</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center py-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white flex items-center justify-center gap-2 rounded-md p-2 px-4"
                onClick={async () => {
                  if (!sale) {
                    toast.error("No se pudo obtener la orden");
                    return;
                  }
                  setLoading(true);
                  const res = await getPaymentLink(sale._id);
                  if (res.success) {
                    redirect(res?.url || "");
                  } else {
                    toast.error(res.message);
                  }
                  setLoading(false);
                }}
              >
                <MercadoPago className="w-6 h-6" />
                Pagar con Mercado Pago
              </button>
              <p className="text-xs mt-2">paga de forma segura</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="w-full flex justify-center gap-4">
            <Button className="w-40" variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentModal;
