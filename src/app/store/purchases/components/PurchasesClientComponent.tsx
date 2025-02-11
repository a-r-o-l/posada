"use client";
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
import { useUser } from "@/context/UserContext";
import { priceParserToString } from "@/lib/utilsFunctions";
import { ISalePopulated } from "@/models/Sale";
import { getSalesByAccount } from "@/server/saleAction";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PaymentBadge from "./PaymentBadge";
import DeliveryBadge from "./DeliveryBadge";
import { Button } from "@/components/ui/button";
import { Banknote, Ellipsis, ReceiptText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaymentModal from "./PaymentModal";

function PurchasesClientComponent() {
  const router = useRouter();
  const { user } = useUser();
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState<ISalePopulated | null>(null);

  useEffect(() => {
    if (user) {
      const fetchSales = async () => {
        const res = await getSalesByAccount(user.id);
        if (res.success) {
          setSales(res.sales);
        }
      };
      fetchSales();
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Compras</CardTitle>
        <CardDescription>
          Historial de todas las compras que realizaste
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Transaccion</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado de pago</TableHead>
              <TableHead>Estado de entrega</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!sales.length ? (
              sales.map((sale: ISalePopulated, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="truncate max-w-20">
                      {format(sale.createdAt!, "dd/MM/yy")}
                    </TableCell>
                    <TableCell className="truncate max-w-32">
                      {sale.order}
                    </TableCell>
                    <TableCell className="truncate max-w-32">
                      {sale.transactionId}
                    </TableCell>
                    <TableCell className="truncate max-w-20">
                      $ {priceParserToString(sale.total)}
                    </TableCell>
                    <TableCell>
                      <PaymentBadge state={sale.status} />
                    </TableCell>
                    <TableCell>
                      <DeliveryBadge state={sale.delivered} />
                    </TableCell>
                    <TableCell className="">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-full"
                            size="icon"
                          >
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="flex items-center justify-between"
                              onClick={() =>
                                router.push(`/store/purchases/${sale._id}`)
                              }
                            >
                              Ver detalles
                              <ReceiptText />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={sale.status !== "pending"}
                              onClick={() => setSelectedSale(sale)}
                            >
                              Pagar ahora
                              <Banknote />
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-60 text-muted-foreground"
                >
                  No hay compras realizadas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <PaymentModal
        open={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        sale={selectedSale}
      />
    </Card>
  );
}

export default PurchasesClientComponent;
