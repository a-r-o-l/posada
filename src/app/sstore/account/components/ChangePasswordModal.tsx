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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/PasswordInput";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/supabase/hooks/client/useProfile";
import { useAuthStore } from "@/zustand/auth-store";

function ChangePasswordModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateProfile, loadingMutation } = useProfile();
  const { currentUser } = useAuthStore();

  const handleUpdatePassword = async () => {
    // 1. Validaciones del formulario (newPassword y confirmPassword)
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);

    try {
      const { data: isPasswordValid, error: verifyError } = await supabase.rpc(
        "verify_user_password",
        { password: password },
      );

      if (verifyError) throw verifyError;
      if (!isPasswordValid) {
        toast.error("La contraseña actual es incorrecta");
        setLoading(false);
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error("La nueva contraseña no puede ser igual a la actual");
        return;
      }
      const { error } = await updateProfile({
        id: currentUser?.id || "",
        password: newPassword,
      });
      console.log(error);
      toast.success("Contraseña actualizada correctamente");
      await supabase.auth.signOut();
      router.push("/?login=true");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Completa el formulario para cambiar tu contraseña
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-2">
            <Label>Contraseña actual</Label>
            <PasswordInput
              value={password}
              onChange={(val) => setPassword(val.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Contraseña nueva</Label>
            <PasswordInput
              value={newPassword}
              onChange={(val) => setNewPassword(val.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Repetir contraseña</Label>
            <PasswordInput
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val.target.value)}
            />
          </div>
          <div className="flex items-center gap-5 justify-end mt-10">
            <Button
              className="px-4 py-2 rounded-full"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="px-4 py-2 rounded-full"
              onClick={handleUpdatePassword}
              disabled={
                loading ||
                !password ||
                !newPassword ||
                !confirmPassword ||
                loadingMutation
              }
              variant="outline"
            >
              {loading && loadingMutation && (
                <Loader2 className="mr-2 animate-spin" />
              )}
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordModal;
