// app/auth/update-password/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordInput from "@/components/PasswordInput";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado (viene del enlace del correo)
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Si no hay sesión, redirigir al login
        toast.error("Enlace inválido o expirado");
        router.push("/?login=true");
      } else {
        setIsValidSession(true);
        setInitialLoading(false);
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error("La contraseña debe ser diferente a la anterior");
        console.error(error);
        return;
      }
      toast.success("Contraseña actualizada correctamente");
      const { error: err } = await supabase.auth.signOut();
      console.log(err);
      router.push("/?login=true");
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!isValidSession) {
    return <div>Verificando acceso...</div>;
  }

  return (
    <div
      onSubmit={handleUpdatePassword}
      className="space-y-4 mx-auto container py-8 px-4 max-w-4xl"
    >
      <div
        style={{ backgroundImage: "url(/logoposada.png)" }}
        className="w-52 h-16 bg-cover bg-center"
      ></div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Actualizar contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para actualizarla. Asegúrate de que
            tenga al menos 6 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div>
              <label htmlFor="password">Nueva contraseña</label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end pt-5">
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full"
                size="lg"
              >
                {loading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
                Actualizar contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
