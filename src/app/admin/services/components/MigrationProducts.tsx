"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Product";
import { getAllProducts } from "@/server/productAction";
import { Product } from "@/supabase/models/product";

function MigrationProducts() {
  const { user } = useUser();

  const [mongoProducts, setMongoProducts] = useState<IProduct[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        const res = await getAllProducts();
        if (res.success) {
          setMongoProducts(res.products);
        }
      };
      fetchProducts();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateProducts = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoProducts.length} productos...`);

    for (const product of mongoProducts) {
      try {
        const response = await fetch("/api/migrate/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product }),
        });

        const result = await response.json();

        if (result.success) {
          addLog(`Producto "${product.name}" migrado correctamente`);
        } else {
          addLog(`Producto "${product.name}": ${result.error}`, true);
        }
      } catch (error: unknown) {
        console.log(error);
        addLog(`Producto "${product.name}": Error de conexión`, true);
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración completada`);
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setLogs([]);
    addLog("📥 Obteniendo productos desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener productos: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} productos en Supabase`);
        setProducts(data);
        console.log("Productos:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Productos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Productos encontrados en MongoDB: {mongoProducts.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateProducts}
                disabled={migrating || mongoProducts.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Productos a Supabase"}
              </Button>

              <Button
                onClick={fetchProducts}
                disabled={loadingProducts}
                variant="outline"
              >
                {loadingProducts ? "Cargando..." : "Ver Productos en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Productos en Supabase ({products.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Nombre:</strong> {product.name}
                      </p>
                      <p>
                        <strong>Descripción:</strong>{" "}
                        {product.description || "Sin descripción"}
                      </p>
                      <p>
                        <strong>Precio:</strong> ${product.price}
                      </p>
                      <p>
                        <strong>School ID:</strong> {product.schoolId}
                      </p>
                      <p>
                        <strong>Descargable:</strong>{" "}
                        {product.isDownloadable ? "Sí" : "No"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>ID:</strong> {product.id}
                      </p>
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

export default MigrationProducts;
