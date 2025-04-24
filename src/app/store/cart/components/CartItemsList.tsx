"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/zustand/useCartStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useMemo, useState } from "react";
import { createPayment } from "@/server/mpAction";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import MercadoPago from "@/icons/mpsvg";

function CartItemsList() {
  const account = useUser();
  const cartItems = useCartStore((state) => state.products);
  const removeProduct = useCartStore((state) => state.removeProduct);
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
      <CardContent>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Lista de productos seleccionados</CardDescription>
        </CardHeader>
        <div className="h-96 overflow-y-auto flex">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archivo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!!cartItems?.length ? (
                cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell
                      align="left"
                      className="w-32 h-32 rounded-xl border-4 flex justify-start my-2"
                    >
                      <AspectRatio ratio={21 / 9}>
                        <Image
                          src={item?.fileImageUrl || "/placeholderimg.jpg"}
                          alt={item?.fileTitle}
                          layout="fill"
                          objectFit="contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </AspectRatio>
                    </TableCell>
                    <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                      {item.name}
                    </TableCell>
                    <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                      $ {item.price}
                    </TableCell>
                    <TableCell className="min-w-14 whitespace-nowrap overflow-ellipsis">
                      $ {item.total}
                    </TableCell>
                    <TableCell align="right" className="min-w-14">
                      <Button
                        size="icon"
                        className="rounded-full"
                        variant="ghost"
                        onClick={() => removeProduct(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="h-60">
                  <TableCell
                    colSpan={7}
                    align="center"
                    className="text-muted-foreground"
                  >
                    No hay productos en el carro.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} align="left" className="font-bold">
                  Monto total
                </TableCell>
                <TableCell
                  align="right"
                  colSpan={1}
                  className="font-bold text-lg"
                >
                  <Badge
                    className="min-w-20 justify-center h-12 text-lg"
                    onClick={() => console.log(cartItems)}
                  >
                    ${" "}
                    {total.toLocaleString("es-ES", {
                      minimumFractionDigits: 0,
                    })}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
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
