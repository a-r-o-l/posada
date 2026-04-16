"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { ISale, ISaleProduct } from "@/models/Sale";
import { getAllSales } from "@/server/saleAction";

function MigrationSales() {
  const { user } = useUser();

  const [mongoSales, setMongoSales] = useState<ISale[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sales, setSales] = useState<ISale[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchSales = async () => {
        const res = await getAllSales();
        if (res.success) {
          setMongoSales(res.sales);
        }
      };
      fetchSales();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateSales = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoSales.length} ventas...`);

    let successCount = 0;
    let errorCount = 0;

    for (const sale of mongoSales) {
      try {
        const response = await fetch("/api/migrate/sale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sale }),
        });

        const result = await response.json();

        if (result.success) {
          successCount++;
          addLog(
            `Venta #${sale.order} (${sale._id}) migrada correctamente - Total: $${sale.total}`,
          );
        } else {
          errorCount++;
          addLog(`Venta #${sale.order}: ${result.error}`, true);
        }
      } catch (error) {
        errorCount++;
        console.log(error);
        addLog(`Venta #${sale.order}: Error de conexión`, true);
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración de ventas completada`);
    addLog(`📊 Resumen: ${successCount} exitosas, ${errorCount} fallidas`);
  };

  const fetchSales = async () => {
    setLoadingSales(true);
    setLogs([]);
    addLog("📥 Obteniendo ventas desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener ventas: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} ventas en Supabase`);
        setSales(data);
        console.log("Ventas:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingSales(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
      in_process: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Ventas</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ventas encontradas en MongoDB: {mongoSales.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateSales}
                disabled={migrating || mongoSales.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Ventas a Supabase"}
              </Button>

              <Button
                onClick={fetchSales}
                disabled={loadingSales}
                variant="outline"
              >
                {loadingSales ? "Cargando..." : "Ver Ventas en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {sales.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Ventas en Supabase ({sales.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p>
                            <strong>Orden #:</strong> {sale.order}
                          </p>
                          <p>
                            <strong>Total:</strong> ${sale.total}
                          </p>
                          <p>
                            <strong>Estado:</strong>{" "}
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(
                                sale.status,
                              )}`}
                            >
                              {sale.status}
                            </span>
                          </p>
                          <p>
                            <strong>Entregado:</strong>{" "}
                            {sale.delivered ? "Sí" : "No"}
                          </p>
                          <p>
                            <strong>Método de pago:</strong>{" "}
                            {sale.paymentMethodId || "No especificado"}
                          </p>
                          <p>
                            <strong>Cuenta ID:</strong> {sale.accountId}
                          </p>
                          {sale.transferStatus && (
                            <p>
                              <strong>Estado transferencia:</strong>{" "}
                              {sale.transferStatus}
                            </p>
                          )}
                          {sale.products && sale.products.length > 0 && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
                                <strong>
                                  Productos ({sale.products.length})
                                </strong>
                              </summary>
                              <div className="mt-1 pl-4 space-y-1">
                                {sale.products.map(
                                  (product: ISaleProduct, idx: number) => (
                                    <div key={idx} className="text-xs">
                                      <p>
                                        • {product.name || product.fileTitle}
                                      </p>
                                      <p className="text-gray-500">
                                        Cantidad: {product.quantity} - Precio: $
                                        {product.price} - Total: $
                                        {product.total}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </details>
                          )}
                          {sale.payer && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-blue-600 dark:text-blue-400">
                                <strong>Datos del pagador</strong>
                              </summary>
                              <div className="mt-1 pl-4 text-xs">
                                {sale.payer.email && (
                                  <p>Email: {sale.payer.email}</p>
                                )}
                                {sale.payer.first_name && (
                                  <p>
                                    Nombre: {sale.payer.first_name}{" "}
                                    {sale.payer.last_name}
                                  </p>
                                )}
                                {sale.payer.identification?.number && (
                                  <p>
                                    Identificación:{" "}
                                    {sale.payer.identification.number}
                                  </p>
                                )}
                              </div>
                            </details>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>ID:</strong> {sale.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Creado:</strong>{" "}
                            {sale.createdAt
                              ? new Date(sale.createdAt).toLocaleString()
                              : "Fecha no disponible"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MigrationSales;
