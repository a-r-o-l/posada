import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/zustand/auth-store";
import { Input } from "./ui/input";

function ForgetPasswordModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuthStore();

  if (currentUser) {
    toast.error("Ya has iniciado sesión. No puedes restablecer la contraseña.");
    setOpen(false);
    return null;
  }

  const handleForgetPassword = async () => {
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        toast.error("Error al enviar el correo de restablecimiento");
        console.log(error);
        return;
      }
      toast.success(
        "Correo de restablecimiento enviado. Revisa tu bandeja de entrada.",
      );
      setOpen(false);
    } catch (error) {
      toast.error("Error al enviar el correo de restablecimiento");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restablecer Contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu correo electrónico para recibir instrucciones sobre cómo
            restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-2">
            <Label>Correo Electrónico</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex items-center gap-5 justify-end mt-10">
            <Button
              className="px-4 rounded-full min-w-40"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="px-4 rounded-full min-w-40"
              onClick={handleForgetPassword}
              variant="outline"
              disabled={loading || !email}
            >
              {loading && <Loader2 className="animate-spin" />}
              Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ForgetPasswordModal;
