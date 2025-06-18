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
import BigCartItemsTable from "./BigCartItemsTable";
import SmallCartItemsTable from "./SmallCartItemsTable";

function CartItemsList() {
  const account = useUser();
  const cartItems = useCartStore((state) => state.products);
  const cleanCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);

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
                    className="bg-blue-500 text-white flex items-center justify-center gap-2 rounded-md p-2 px-4"
                  >
                    <MercadoPago className="w-6 h-6" />
                    Pagar con Mercado Pago
                  </button>
                  <p className="text-xs mt-2">paga de forma segura</p>
                </>
              )}
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItemsList;
