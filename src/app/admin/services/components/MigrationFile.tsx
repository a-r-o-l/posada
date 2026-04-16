"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { IFile } from "@/models/File";
import { getAllFiles } from "@/server/fileAction";

interface SupabaseFile {
  id: string;
  file_name: string;
  title: string;
  description: string;
  folder_id: string;
  image_url: string;
  original_image_url: string;
  price: number;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

function MigrationFiles() {
  const { user } = useUser();

  const [mongoFiles, setMongoFiles] = useState<IFile[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [files, setFiles] = useState<SupabaseFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchFiles = async () => {
        const res = await getAllFiles();
        if (res.success) {
          setMongoFiles(res.files);
        }
      };
      fetchFiles();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateFiles = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoFiles.length} archivos...`);

    for (const file of mongoFiles) {
      try {
        const response = await fetch("/api/migrate/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file }),
        });

        const result = await response.json();

        if (result.success) {
          addLog(
            `Archivo "${file.title}" (${file.fileName}) migrado correctamente`,
          );
        } else {
          addLog(`Archivo "${file.title}": ${result.error}`, true);
        }
      } catch (error) {
        console.log(error);
        addLog(`Archivo "${file.title}": Error de conexión`, true);
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración de archivos completada`);
  };

  const fetchFiles = async () => {
    setLoadingFiles(true);
    setLogs([]);
    addLog("📥 Obteniendo archivos desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener archivos: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} archivos en Supabase`);
        setFiles(data);
        console.log("Archivos:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingFiles(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Archivos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Archivos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Archivos encontrados en MongoDB: {mongoFiles.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateFiles}
                disabled={migrating || mongoFiles.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Archivos a Supabase"}
              </Button>

              <Button
                onClick={fetchFiles}
                disabled={loadingFiles}
                variant="outline"
              >
                {loadingFiles ? "Cargando..." : "Ver Archivos en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Archivos en Supabase ({files.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Título:</strong> {file.title}
                      </p>
                      <p>
                        <strong>Nombre archivo:</strong> {file.file_name}
                      </p>
                      <p>
                        <strong>Descripción:</strong>{" "}
                        {file.description || "Sin descripción"}
                      </p>
                      <p>
                        <strong>Precio:</strong> ${file.price}
                      </p>
                      <p>
                        <strong>Folder ID:</strong>{" "}
                        {file.folder_id || "Sin carpeta"}
                      </p>
                      <p>
                        <strong>Nuevo:</strong> {file.is_new ? "Sí" : "No"}
                      </p>
                      {file.image_url && (
                        <p className="text-xs truncate">
                          <strong>Imagen:</strong> {file.image_url}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        <strong>ID:</strong> {file.id}
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

export default MigrationFiles;
