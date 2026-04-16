"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { IStudent } from "@/models/Student";
import { getAllStudentsMigration } from "@/server/studentAction";

interface SupabaseStudent {
  id: string;
  name: string;
  lastname: string;
  display_name: string | null;
  grade_id: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

function MigrationStudents() {
  const { user } = useUser();

  const [mongoStudents, setMongoStudents] = useState<IStudent[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [students, setStudents] = useState<SupabaseStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchStudents = async () => {
        const res = await getAllStudentsMigration();
        if (res.success) {
          setMongoStudents(res.students);
        }
      };
      fetchStudents();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateStudents = async () => {
    setMigrating(true);
    setLogs([]);
    addLog(`🚀 Iniciando migración de ${mongoStudents.length} estudiantes...`);

    let successCount = 0;
    let errorCount = 0;

    for (const student of mongoStudents) {
      try {
        const response = await fetch("/api/migrate/student/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student._id,
            gradeId: student.gradeId,
            schoolId: student.schoolId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          successCount++;
          addLog(
            `Estudiante "${student.displayName || student.name} ${student.lastname}" (${student._id}) migrado correctamente`,
          );
        } else {
          errorCount++;
          addLog(
            `Estudiante "${student.name} ${student.lastname}": ${result.error}`,
            true,
          );
        }
      } catch (error) {
        errorCount++;
        console.log(error);
        addLog(
          `Estudiante "${student.name} ${student.lastname}": Error de conexión`,
          true,
        );
      }
    }
    setMigrating(false);
    addLog(`🏁 Migración de estudiantes completada`);
    addLog(`📊 Resumen: ${successCount} exitosas, ${errorCount} fallidas`);
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    setLogs([]);
    addLog("📥 Obteniendo estudiantes desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener estudiantes: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} estudiantes en Supabase`);
        setStudents(data);
        console.log("Estudiantes:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migración de Estudiantes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Estudiantes</h3>
            <p className="text-sm text-gray-500 mb-4">
              Estudiantes encontrados en MongoDB: {mongoStudents.length}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={migrateStudents}
                disabled={migrating || mongoStudents.length === 0}
                variant="default"
              >
                {migrating ? "Migrando..." : "Migrar Estudiantes a Supabase"}
              </Button>

              <Button
                onClick={fetchStudents}
                disabled={loadingStudents}
                variant="outline"
              >
                {loadingStudents
                  ? "Cargando..."
                  : "Ver Estudiantes en Supabase"}
              </Button>
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {students.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Estudiantes en Supabase ({students.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Nombre completo:</strong> {student.name}{" "}
                        {student.lastname}
                      </p>
                      <p>
                        <strong>Nombre a mostrar:</strong>{" "}
                        {student.display_name || "No especificado"}
                      </p>
                      <p>
                        <strong>Grade ID:</strong> {student.grade_id}
                      </p>
                      <p>
                        <strong>School ID:</strong> {student.school_id}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>ID:</strong> {student.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Creado:</strong>{" "}
                        {student.created_at
                          ? new Date(student.created_at).toLocaleString()
                          : "Fecha no disponible"}
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

export default MigrationStudents;
