"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDigitalDownloads } from "@/supabase/hooks/client/useDigitalDownloads";
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect } from "react";
import { DigitalDownloadsGrid } from "./PictureComponent";
import { DigitalDownload } from "@/supabase/models/digital_downloads";
import { Loader2 } from "lucide-react";

function PicturesClient() {
  const { currentUser } = useAuthStore();
  const { digitaldownloads, fetchDigitaldownloadsByAccountId, loading } =
    useDigitalDownloads();

  useEffect(() => {
    if (currentUser) {
      fetchDigitaldownloadsByAccountId(currentUser.id);
    }
  }, [currentUser]);
  // useEffect(() => {
  //   setMigrating(false);
  //   if (user) {
  //     const fetchAccounts = async () => {
  //       const res = await getAllAccounts();
  //       if (res.success) {
  //         setMongoUsers(res.accounts);
  //       }
  //     };
  //     fetchAccounts();
  //   }
  // }, [user]);

  // const addLog = (message: string, isError = false) => {
  //   setLogs((prev) => [
  //     ...prev,
  //     `${new Date().toLocaleTimeString()} - ${isError ? "❌" : "✅"} ${message}`,
  //   ]);
  // };

  // const migrateUsers = async () => {
  //   for (const user of mongoUsers) {
  //     const response = await fetch("/api/migrate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ user }),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       addLog(`✅ ${user.email} migrado`);
  //     } else {
  //       addLog(`❌ ${user.email}: ${result.error}`);
  //     }
  //   }
  // };

  // const fetchProfiles = async () => {
  //   setLoadingProfiles(true);
  //   setLogs([]);
  //   addLog("📥 Obteniendo perfiles desde Supabase...");

  //   try {
  //     const { data, error } = await supabase
  //       .from("profile")
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       addLog(`❌ Error al obtener perfiles: ${error.message}`, true);
  //     } else {
  //       addLog(`✅ Se encontraron ${data.length} perfiles en Supabase`);
  //       setProfiles(data);
  //       console.log("Perfiles:", data);
  //     }
  //   } catch (error: unknown) {
  //     const errMsg =
  //       error instanceof Error ? error.message : "Error desconocido";
  //     addLog(`❌ Error: ${errMsg}`, true);
  //   } finally {
  //     setLoadingProfiles(false);
  //   }
  // };

  const handleDownload = async (download: DigitalDownload) => {
    if (download.status !== "approved") return;

    try {
      const response = await fetch(download.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = download.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Fotos</CardTitle>
        <CardDescription>
          Descargas disponibles de tus fotos compradas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 h-60 justify-center items-center flex">
              <Loader2 className="animate-spin mx-auto" />
            </div>
          ) : (
            digitaldownloads.map((download) => (
              <DigitalDownloadsGrid
                download={download}
                key={download.id}
                handleDownload={handleDownload}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PicturesClient;
