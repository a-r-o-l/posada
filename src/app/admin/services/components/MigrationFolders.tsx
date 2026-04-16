"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { IFolder } from "@/models/Folder";
import { getAllFoldersMigration } from "@/server/folderAction";

interface SupabaseFolder {
  id: string;
  type: string;
  title: string;
  description: string | null;
  school_id: string | null;
  password: string | null;
  is_private: boolean;
  image_url: string | null;
  grades: string[] | null;
  parent_folder: string | null;
  year: string | null;
  level: string;
  created_at: string;
  updated_at: string;
}

function MigrationFolders() {
  const { user } = useUser();

  const [mongoFolders, setMongoFolders] = useState<IFolder[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [folders, setFolders] = useState<SupabaseFolder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchFolders = async () => {
        const res = await getAllFoldersMigration();
        if (res.success) {
          setMongoFolders(res.folders);
        }
      };
      fetchFolders();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateFolders = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoFolders.length} carpetas...`);

    for (const folder of mongoFolders) {
      try {
        const response = await fetch("/api/migrate/folder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });

        const result = await response.json();

        if (result.success) {
          addLog(
            `Carpeta "${folder.title}" (${folder._id}) migrada correctamente`,
          );
        } else {
          addLog(`Carpeta "${folder.title}": ${result.error}`, true);
        }
      } catch (error) {
        console.log(error);
        addLog(`Carpeta "${folder.title}": Error de conexión`, true);
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración de carpetas completada`);
  };

  const fetchFolders = async () => {
    setLoadingFolders(true);
    setLogs([]);
    addLog("📥 Obteniendo carpetas desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener carpetas: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} carpetas en Supabase`);
        setFolders(data);
        console.log("Carpetas:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingFolders(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Carpetas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Carpetas</h3>
            <p className="text-sm text-gray-500 mb-4">
              Carpetas encontradas en MongoDB: {mongoFolders.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateFolders}
                disabled={migrating || mongoFolders.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Carpetas a Supabase"}
              </Button>

              <Button
                onClick={fetchFolders}
                disabled={loadingFolders}
                variant="outline"
              >
                {loadingFolders ? "Cargando..." : "Ver Carpetas en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {folders.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Carpetas en Supabase ({folders.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Título:</strong> {folder.title}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {folder.type}
                      </p>
                      <p>
                        <strong>Descripción:</strong>{" "}
                        {folder.description || "Sin descripción"}
                      </p>
                      <p>
                        <strong>School ID:</strong>{" "}
                        {folder.school_id || "No asignada"}
                      </p>
                      <p>
                        <strong>Privada:</strong>{" "}
                        {folder.is_private ? "Sí" : "No"}
                      </p>
                      <p>
                        <strong>Nivel:</strong> {folder.level}
                      </p>
                      <p>
                        <strong>Año:</strong> {folder.year || "No especificado"}
                      </p>
                      {folder.grades && folder.grades.length > 0 && (
                        <p>
                          <strong>Grados:</strong> {folder.grades.join(", ")}
                        </p>
                      )}
                      {folder.parent_folder && (
                        <p>
                          <strong>Carpeta padre:</strong> {folder.parent_folder}
                        </p>
                      )}
                      {folder.image_url && (
                        <p className="text-xs truncate">
                          <strong>Imagen:</strong> {folder.image_url}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        <strong>ID:</strong> {folder.id}
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

export default MigrationFolders;
