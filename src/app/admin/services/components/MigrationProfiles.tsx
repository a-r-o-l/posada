"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { Profile } from "@/supabase/models/profile";
import { getAllAccountsMigration } from "@/server/accountAction";
import { supabase } from "@/supabase/supabase";

import React, { useEffect, useState } from "react";
import { IAccount } from "@/models/Account";

function MigrationProfiles() {
  const { user } = useUser();

  const [mongoUsers, setMongoUsers] = useState<IAccount[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchAccounts = async () => {
        const res = await getAllAccountsMigration();
        if (res.success) {
          setMongoUsers(res.accounts);
        }
      };
      fetchAccounts();
    }
  }, [user]);

  const addLog = (message: string, isError = false) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
    ]);
  };

  const migrateUsers = async () => {
    setMigrating(true);
    for (const user of mongoUsers) {
      const response = await fetch("/api/migrate/profiles/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          availableGrades: user.availableGrades,
          children: user.children,
        }),
      });

      const result = await response.json();

      if (result.success) {
        addLog(`✅ ${user.email} migrado`);
      } else {
        addLog(`❌ ${user.email}: ${result.error}`);
      }
    }
    setMigrating(false);
  };

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    setLogs([]);
    addLog("📥 Obteniendo perfiles desde Supabase...");

    try {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog(`❌ Error al obtener perfiles: ${error.message}`, true);
      } else {
        addLog(`✅ Se encontraron ${data.length} perfiles en Supabase`);
        setProfiles(data);
        console.log("Perfiles:", data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`, true);
    } finally {
      setLoadingProfiles(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migraciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          {/* Botón de migración - solo visible para admin */}
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold mb-2">Migración de Usuarios</h3>
            <p className="text-sm text-gray-500 mb-4">
              Usuarios encontrados en MongoDB: {mongoUsers.length}
            </p>
            <Button
              onClick={migrateUsers}
              disabled={migrating || mongoUsers.length === 0}
              variant="default"
            >
              {migrating ? "Migrando..." : "Migrar Usuarios a Supabase"}
            </Button>

            <Button
              onClick={fetchProfiles}
              disabled={loadingProfiles}
              variant="outline"
              className="ml-2"
            >
              {loadingProfiles ? "Cargando..." : "Ver Perfiles en Supabase"}
            </Button>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-black text-green-400 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {profiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Usuarios en Supabase ({profiles.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <p>
                        <strong>Email:</strong> {profile.email}
                      </p>
                      <p>
                        <strong>Nombre:</strong> {profile.name}{" "}
                        {profile.lastname}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {profile.role}
                      </p>
                      <p>
                        <strong>ID:</strong> {profile.id}
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

export default MigrationProfiles;
