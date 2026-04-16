"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { IGrade } from "@/models/Grade";
import { getAllGrades } from "@/server/gradeAction";

interface SupabaseGrade {
  id: string;
  grade: string;
  division: string;
  display_name: string;
  school_id: string;
  year: string;
  created_at: string;
}

function MigrationGrades() {
  const { user } = useUser();

  const [mongoGrades, setMongoGrades] = useState<IGrade[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [grades, setGrades] = useState<SupabaseGrade[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchGrades = async () => {
        const res = await getAllGrades();
        if (res.success) {
          setMongoGrades(res.grades);
        }
      };
      fetchGrades();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateGrades = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoGrades.length} grados...`);

    for (const grade of mongoGrades) {
      try {
        const response = await fetch("/api/migrate/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade }),
        });

        const result = await response.json();

        if (result.success) {
          addLog(
            `Grado "${grade.displayName}" (${grade.grade} ${grade.division}) migrado correctamente`,
          );
        } else {
          addLog(`Grado "${grade.displayName}": ${result.error}`, true);
        }
      } catch (error) {
        console.log(error);
        addLog(`Grado "${grade.displayName}": Error de conexión`, true);
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración de grados completada`);
  };

  const fetchGrades = async () => {
    setLoadingGrades(true);
    setLogs([]);
    addLog("📥 Obteniendo grados desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("grades")
        .select("*")
        .order("grade", { ascending: true })
        .order("division", { ascending: true });

      if (error) {
        addLog(`❌ Error al obtener grados: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} grados en Supabase`);
        setGrades(data);
        console.log("Grados:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingGrades(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Grados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Grados</h3>
            <p className="text-sm text-gray-500 mb-4">
              Grados encontrados en MongoDB: {mongoGrades.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateGrades}
                disabled={migrating || mongoGrades.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Grados a Supabase"}
              </Button>

              <Button
                onClick={fetchGrades}
                disabled={loadingGrades}
                variant="outline"
              >
                {loadingGrades ? "Cargando..." : "Ver Grados en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {grades.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Grados en Supabase ({grades.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {grades.map((grade) => (
                    <div
                      key={grade.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Grado:</strong> {grade.grade}
                      </p>
                      <p>
                        <strong>División:</strong> {grade.division}
                      </p>
                      <p>
                        <strong>Nombre mostrado:</strong> {grade.display_name}
                      </p>
                      <p>
                        <strong>School ID:</strong> {grade.school_id}
                      </p>
                      <p>
                        <strong>Año:</strong> {grade.year || "No especificado"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>ID:</strong> {grade.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Creado:</strong>{" "}
                        {new Date(grade.created_at).toLocaleString()}
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

export default MigrationGrades;
