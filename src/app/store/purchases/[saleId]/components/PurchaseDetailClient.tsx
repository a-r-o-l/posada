"use client";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISalePopulated } from "@/models/Sale";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import PaymentBadge from "../../components/PaymentBadge";
import DeliveryBadge from "../../components/DeliveryBadge";
import PaymentModal from "../../components/PaymentModal";

function PurchaseDetailClient({ sale }: { sale: ISalePopulated }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const products = useMemo(() => {
    if (!sale) {
      return [];
    }
    return sale.products;
  }, [sale]);

  if (!sale) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full justify-between">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
          {sale.status !== "approved" && sale.paymentTypeId !== "transfer" && (
            <Button
              className="flex items-center justify-center gap-2 rounded-md p-2 px-4"
              variant="secondary"
              onClick={() => setOpen(true)}
            >
              Pagar ahora
            </Button>
          )}
        </div>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la orden</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Transaccion</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Entrega</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{sale.order}</TableCell>
                    <TableCell>{sale.transactionId}</TableCell>
                    <TableCell>
                      {format(sale.createdAt!, "dd / MM / yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>{sale?.accountId?.email}</TableCell>
                    <TableCell>${sale?.total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <PaymentBadge
                        state={sale?.status}
                        paymentTypeId={sale?.paymentTypeId}
                        transferProofUrl={sale?.transferProofUrl}
                      />
                    </TableCell>
                    <TableCell>
                      <DeliveryBadge state={sale?.delivered} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de productos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio U.</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <NextImage
                          src={product.fileImageUrl || "/placeholder.svg"}
                          alt={product.fileTitle}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                      </TableCell>
                      <TableCell>{product?.fileTitle}</TableCell>
                      <TableCell>{product?.productId?.name}</TableCell>
                      <TableCell>$ {product?.price?.toFixed(2)}</TableCell>
                      <TableCell>{product?.quantity}</TableCell>
                      <TableCell align="right">
                        $ {product?.total?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <PaymentModal open={open} onClose={() => setOpen(false)} sale={sale} />
    </Card>
  );
}

export default PurchaseDetailClient;
