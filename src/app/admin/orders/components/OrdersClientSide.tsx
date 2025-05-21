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
import { priceParserToString } from "@/lib/utilsFunctions";
import { Input } from "@/components/ui/input";
import { CircleX, Search } from "lucide-react";

function OrdersClientSide({ sales = [] }: { sales?: ISalePopulated[] | [] }) {
  const router = useRouter();
  const [selectedSale, setSelectedSale] = useState<ISalePopulated | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchParams, setSearchParams] = useState("");

  useEffect(() => {
    if (selectedSale && selectedSale.isNewSale) {
      const runReadSale = async () =>
        await updateSaleStatus(selectedSale._id, "isNewSale", false);
      runReadSale();
    }
  }, [selectedSale]);

  const filteredSales = useMemo(() => {
    if (!sales || !sales.length) return [];
    if (!searchParams) return sales;
    const filtered = sales.filter((sale) => {
      const email = sale?.accountId?.email?.toLowerCase();
      if (email && email.includes(searchParams.toLowerCase())) {
        return true;
      }
      return false;
    });
    return filtered;
  }, [searchParams, sales]);

  const salesQuantity = useMemo(() => {
    if (!filteredSales || !filteredSales.length)
      return { totalSales: 0, newSales: 0 };
    const totalSales = filteredSales?.length;
    const newSales = filteredSales?.filter((sale) => !sale.isNewSale).length;
    return { totalSales, newSales };
  }, [filteredSales]);

  const salesTotal = useMemo(() => {
    if (!filteredSales || !filteredSales.length) return 0;
    const total = filteredSales?.reduce((acc, sale) => {
      if (sale.total) {
        return acc + sale.total;
      }
      return acc;
    }, 0);
    return total;
  }, [filteredSales]);

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
        <div className="relative w-60">
          <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
          {!!searchParams && (
            <CircleX
              className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-red-500"
              onClick={() => {
                setSearchParams("");
              }}
            />
          )}
          <Input
            placeholder="Buscar por email"
            className="w-60 pl-10"
            value={searchParams}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchParams("");
              }
            }}
            onChange={(e) => {
              setSearchParams(e.target.value.toLowerCase());
            }}
          />
        </div>
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
            {!!filteredSales.length ? (
              filteredSales.map((sale) => (
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
              <TableCell colSpan={7} align="left" className="text-xl font-bold">
                Total
              </TableCell>
              <TableCell colSpan={1} className="" align="right">
                <Badge className="text-xl">
                  ${priceParserToString(salesTotal)}
                </Badge>
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
