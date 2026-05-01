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
import UploadProofModal from "./UploadProofModal";
import { toast } from "sonner";
import { useAuthStore } from "@/zustand/auth-store";
import { useSales } from "@/supabase/hooks/client/useSales";
import { SaleFullDetails } from "@/supabase/models/sale";

function PurchasesClientComponent() {
  const router = useRouter();
  const { currentUser: user } = useAuthStore();
  const { fetchSaleItemsByAccountId, sales } = useSales();
  // const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState<SaleFullDetails | null>(
    null,
  );
  const [openProofModal, setOpenProofModal] = useState(false);
  const [saleToUpload, setSaleToUpload] = useState<SaleFullDetails | null>(
    null,
  );

  useEffect(() => {
    if (user) {
      fetchSaleItemsByAccountId(user.id);
      // const fetchSales = async () => {
      //   const res = await getSalesByAccount(user.id);
      //   if (res.success) {
      //     setSales(res.sales);
      //   }
      // };
      // fetchSales();
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
              <TableHead>Tipo de pago</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado de pago</TableHead>
              <TableHead>Estado de entrega</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!sales.length ? (
              sales.map((sale: SaleFullDetails, index) => {
                const isTransfer = sale.payment_type_id === "transfer";
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
                    <TableCell>
                      <DeliveryBadge state={sale.delivered || false} />
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
      <UploadProofModal
        open={openProofModal}
        onClose={() => {
          setOpenProofModal(false);
          setSaleToUpload(null);
        }}
        onUpload={async (file: File) => {
          if (!saleToUpload) return;
          const formData = new FormData();
          formData.append("transferProof", file);
          // Puedes crear un endpoint updateTransferProof en saleAction
          const res = await (
            await import("@/server/saleAction")
          ).updateTransferProof(saleToUpload.id, formData);
          if (res.success) {
            toast.success(
              "¡Comprobante enviado! Tu compra estará pendiente hasta que el administrador la apruebe.",
            );
            // Opcional: refrescar ventas
            // const updatedSales = await getSalesByAccount(user?.id || "");
            // if (updatedSales.success) setSales(updatedSales.sales);
          } else {
            toast.error(res.message || "Error al subir el comprobante");
          }
        }}
      />
    </Card>
  );
}

export default PurchasesClientComponent;
