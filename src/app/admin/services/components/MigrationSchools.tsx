"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { ISchool } from "@/models/School";
import { getAllSchools } from "@/server/schoolAction";
import { School } from "@/supabase/models/school";

function MigrationSchools() {
  const { user } = useUser();

  const [mongoSchools, setMongoSchools] = useState<ISchool[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchSchools = async () => {
        const res = await getAllSchools();
        if (res.success) {
          setMongoSchools(res.schools);
        }
      };
      fetchSchools();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateSchools = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoSchools.length} escuelas...`);

    for (const school of mongoSchools) {
      try {
        const response = await fetch("/api/migrate/school", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school }),
        });

        const result = await response.json();

        if (result.success) {
          addLog(
            `Escuela "${school.name}" (${school._id}) migrada correctamente`,
          );
        } else {
          addLog(`Escuela "${school.name}": ${result.error}`, true);
        }
      } catch (error) {
        console.log(error);
        addLog(`Escuela "${school.name}": Error de conexión`, true);
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración de escuelas completada`);
  };

  const fetchSchools = async () => {
    setLoadingSchools(true);
    setLogs([]);
    addLog("📥 Obteniendo escuelas desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener escuelas: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} escuelas en Supabase`);
        setSchools(data);
        console.log("Escuelas:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingSchools(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Escuelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Escuelas</h3>
            <p className="text-sm text-gray-500 mb-4">
              Escuelas encontradas en MongoDB: {mongoSchools.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateSchools}
                disabled={migrating || mongoSchools.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Escuelas a Supabase"}
              </Button>

              <Button
                onClick={fetchSchools}
                disabled={loadingSchools}
                variant="outline"
              >
                {loadingSchools ? "Cargando..." : "Ver Escuelas en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {schools.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Escuelas en Supabase ({schools.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Nombre:</strong> {school.name}
                      </p>
                      <p>
                        <strong>Descripción:</strong>{" "}
                        {school.description || "Sin descripción"}
                      </p>
                      <p>
                        <strong>Privada:</strong>{" "}
                        {school.isPrivate ? "Sí" : "No"}
                      </p>
                      <p>
                        <strong>Contraseña:</strong>{" "}
                        {school.password ? "🔒 Protegida" : "Sin contraseña"}
                      </p>
                      <p>
                        <strong>Carpetas:</strong>{" "}
                        {Array.isArray(school.folders)
                          ? school.folders.length
                          : 0}{" "}
                        carpetas
                      </p>
                      {school.imageUrl && (
                        <p className="text-xs truncate">
                          <strong>Imagen:</strong> {school.imageUrl}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        <strong>ID:</strong> {school.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Creado:</strong>{" "}
                        {new Date(school.createdAt).toLocaleString()}
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

export default MigrationSchools;
