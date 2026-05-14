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
import { priceParserToString } from "@/lib/utilsFunctions";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PaymentBadge from "./PaymentBadge";
import { Button } from "@/components/ui/button";

import PaymentModal from "./PaymentModal";
import { useAuthStore } from "@/zustand/auth-store";
import { useSales } from "@/supabase/hooks/client/useSales";
import { SaleFullDetails } from "@/supabase/models/sale";
import LoadingTable from "@/components/LoadingTable";

function PurchasesClientComponent() {
  const router = useRouter();
  const { currentUser: user } = useAuthStore();
  const { fetchSaleItemsByAccountId, sales, queryLoading } = useSales();
  // const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState<SaleFullDetails | null>(
    null,
  );

  useEffect(() => {
    if (user) {
      fetchSaleItemsByAccountId(user.id);
    }
  }, [user]);

  return (
    <Card className="p-0">
      <CardHeader className="p-3 md:p-6">
        <CardTitle className="text-sm md:text-base">Mis Compras</CardTitle>
        <CardDescription className="text-xs md:text-base">
          Historial de todas las compras que realizaste
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <Table className="text-xs md:text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Tipo de pago</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado de pago</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryLoading ? (
              <LoadingTable span={7} />
            ) : !!sales.length ? (
              sales.map((sale: SaleFullDetails, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="truncate max-w-20">
                      {format(sale.created_at!, "dd/MM/yy")}
                    </TableCell>
                    <TableCell className="truncate max-w-32">
                      {sale.order}
                    </TableCell>
                    <TableCell className="truncate max-w-24">
                      {sale.payment_type_id === "transfer"
                        ? "Transferencia"
                        : "MercadoPago"}
                    </TableCell>
                    <TableCell className="truncate max-w-20">
                      $ {sale?.total ? priceParserToString(sale?.total) : "0"}
                    </TableCell>
                    <TableCell>
                      <PaymentBadge
                        state={sale.status || ""}
                        paymentTypeId={sale.payment_type_id || ""}
                        transferProofUrl={sale.transfer_proof_url || ""}
                      />
                    </TableCell>
                    <TableCell className="">
                      <Button
                        className="flex items-center justify-between"
                        variant="outline"
                        onClick={() =>
                          router.push(`/store/account/purchases/${sale.id}`)
                        }
                      >
                        Ver detalles
                      </Button>
                      {/* <DropdownMenu>
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
                                router.push(
                                  `/store/account/purchases/${sale.id}`,
                                )
                              }
                            >
                              Ver detalles
                              <ReceiptText />
                            </DropdownMenuItem>
                            {!isTransfer && (
                              <DropdownMenuItem
                                disabled={sale.status !== "pending"}
                                onClick={() => setSelectedSale(sale)}
                              >
                                Pagar ahora
                                <Banknote />
                              </DropdownMenuItem>
                            )}
                            {isTransfer && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSaleToUpload(sale);
                                  setOpenProofModal(true);
                                }}
                                disabled={
                                  sale.transfer_status === "approved" ||
                                  !!sale.transfer_proof_url
                                }
                              >
                                {sale.transfer_proof_url
                                  ? "Actualizar comprobante de transferencia"
                                  : "Subir comprobante de transferencia"}
                                <Banknote />
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
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
