"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { ISalePopulated } from "@/models/Sale";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DatePicker from "./DatePicker";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { updateSaleStatus } from "@/server/saleAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StateSelect from "./StateSelect";
import PaymentBadge from "@/app/store/purchases/components/PaymentBadge";
import DeliveredSelect from "./DeliveredSelect";

function OrdersClientSide({ sales = [] }: { sales?: ISalePopulated[] | [] }) {
  const router = useRouter();
  const [selectedSale, setSelectedSale] = useState<ISalePopulated | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (selectedSale && selectedSale.isNewSale) {
      const runReadSale = async () =>
        await updateSaleStatus(selectedSale._id, "isNewSale", false);
      runReadSale();
    }
  }, [selectedSale]);

  const salesQuantity = useMemo(() => {
    if (!sales || !sales.length) return { totalSales: 0, newSales: 0 };
    const totalSales = sales?.length;
    const newSales = sales?.filter((sale) => !sale.isNewSale).length;
    return { totalSales, newSales };
  }, [sales]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full">
          <div className="flex items-center gap-5">
            <CardTitle>Pedidos</CardTitle>
            <Badge variant="outline" className="ml-2">
              {salesQuantity.newSales} / {salesQuantity.totalSales}
            </Badge>
          </div>
          <div className="flex flex-1 justify-around">
            <div className="flex flex-col space-y-2 justify-center items-center w-80">
              <Label>Filtrar por fecha</Label>
              <DatePicker url="/admin/orders" />
            </div>
            <div className="flex flex-col space-y-2 justify-center items-center w-80">
              <Label>Filtrar por estado de pago</Label>
              <StateSelect url="/admin/orders" />
            </div>
            <div className="flex flex-col space-y-2 justify-center items-center w-80">
              <Label>Filtrar por estado de entrega</Label>
              <DeliveredSelect url="/admin/orders" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="mt-10">
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!sales.length ? (
              sales.map((sale) => (
                <TableRow
                  key={sale._id}
                  className={`${
                    sale.isNewSale ? "opacity-30" : ""
                  } cursor-pointer ${
                    selectedSale?._id === sale._id
                      ? "bg-blue-950 text-white"
                      : ""
                  }`}
                  onClick={() => setSelectedSale(sale)}
                >
                  <TableCell>{sale.order}</TableCell>
                  <TableCell>
                    {sale.paymentTypeId === "account_money"
                      ? "Efectivo"
                      : "Tarjeta"}
                  </TableCell>
                  <TableCell>
                    {format(sale.createdAt!, "dd / MM / yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>{sale?.accountId?.email}</TableCell>
                  <TableCell>${sale?.total?.toFixed(2)}</TableCell>
                  <TableCell>
                    <PaymentBadge state={sale?.status || ""} />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={sale.delivered}
                      onClick={() => {
                        setSelectedSale(sale);
                        setOpenAlert(true);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outline"
                      className="text-black dark:text-white"
                      onClick={() => {
                        setSelectedSale(sale);
                        router.push(`/admin/orders/${sale._id}`);
                      }}
                    >
                      Ver detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  className="h-60 text-muted-foreground"
                >
                  No hay pedidos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="">
              <TableCell colSpan={5} align="left" className="">
                Total
              </TableCell>
              <TableCell colSpan={4} className="">
                <Badge>$567567</Badge>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CustomAlertDialog
        open={openAlert}
        onClose={() => {
          setOpenAlert(false);
          setSelectedSale(null);
        }}
        title="Actualizar estado"
        description="Estas seguro de actualizar el estado de este pedido?"
        onAccept={async () => {
          if (!selectedSale) return;
          setUpdateLoading(true);
          const currentState = selectedSale?.delivered;
          const res = await updateSaleStatus(
            selectedSale._id,
            "delivered",
            !currentState
          );
          if (res.success) {
            toast.success(res.message);
            setOpenAlert(false);
            setSelectedSale(null);
            setUpdateLoading(false);
          } else {
            toast.error(res.message);
            setUpdateLoading(false);
          }
        }}
        loading={updateLoading}
      />
    </Card>
  );
}

export default OrdersClientSide;
