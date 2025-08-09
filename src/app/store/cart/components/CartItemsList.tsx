"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/zustand/useCartStore";
import { redirect } from "next/navigation";
import React, { useMemo, useState } from "react";
import { createPayment } from "@/server/mpAction";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import MercadoPago from "@/icons/mpsvg";
import { Banknote } from "lucide-react";
import TransferModal from "./TransferModal";
import BigCartItemsTable from "./BigCartItemsTable";
import SmallCartItemsTable from "./SmallCartItemsTable";
import { createTransferSale } from "@/server/saleAction";

function CartItemsList() {
  const account = useUser();
  const cartItems = useCartStore((state) => state.products);
  const cleanCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);

  const total = useMemo(() => {
    return cartItems
      .map((item) => item.price * item.quantity)
      .reduce((acc, curr) => acc + curr, 0);
  }, [cartItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold">Procesando pago...</h1>
      </div>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="w-full px-0">
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Lista de productos seleccionados</CardDescription>
        </CardHeader>
        <BigCartItemsTable total={total} />
        <SmallCartItemsTable total={total} />
        <div className="mt-10 flex flex-col justify-center items-center w-full">
          <div className="text-center">
            <form
              action={async () => {
                setLoading(true);
                const formData = new FormData();
                formData.append("products", JSON.stringify(cartItems));
                formData.append("accountId", account?.user?.id || "");
                formData.append("total", total.toString());
                const res = await createPayment(formData);
                if (res.success && res.url) {
                  setLoading(false);
                  cleanCart();
                  redirect(res.url);
                } else {
                  console.error("Error:", res.message);
                  toast.error(res.message);
                  setLoading(false);
                }
              }}
            >
              {!!cartItems.length && (
                <>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white flex items-center justify-center gap-2 rounded-md p-2 px-4 mb-3"
                  >
                    <MercadoPago className="w-6 h-6" />
                    Pagar con Mercado Pago
                  </button>
                  <p className="text-xs mb-4">paga de forma segura</p>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center gap-2 rounded-md p-2 px-4 shadow-md hover:scale-105 transition-transform duration-150"
                    onClick={() => setOpenTransferModal(true)}
                  >
                    <Banknote className="w-6 h-6" />
                    Pagar con transferencia
                  </button>
                  <p className="text-xs mt-2 text-gray-500">
                    sube tu comprobante y espera la aprobación
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </CardContent>
      <TransferModal
        open={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
        total={total}
        onConfirm={async (proofFile?: File) => {
          setLoading(true);
          try {
            const formData = new FormData();
            formData.append("products", JSON.stringify(cartItems));
            formData.append("accountId", account?.user?.id || "");
            formData.append("total", total.toString());
            formData.append("paymentTypeId", "transfer");
            if (proofFile) {
              formData.append("transferProof", proofFile);
            }
            const res = await createTransferSale(formData);
            if (res.success) {
              cleanCart();
              if (proofFile) {
                toast.success(
                  "Venta creada correctamente con comprobante subido. Espera la aprobación del administrador."
                );
              } else {
                toast.success(
                  "Venta creada correctamente. Puedes subir el comprobante desde Mis Compras."
                );
              }
            } else {
              toast.error(res.message || "Error al crear la venta");
            }
          } catch (err) {
            console.error("Error inesperado:", err);
            toast.error("Error inesperado");
          }
          setLoading(false);
        }}
      />
    </Card>
  );
}

export default CartItemsList;
