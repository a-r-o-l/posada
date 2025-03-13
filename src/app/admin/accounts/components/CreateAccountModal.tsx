"use client";
import LoadingButton from "@/components/LoadingButton";
import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createAccount } from "@/server/accountAction";
import React, { useState } from "react";
import { toast } from "sonner";

function CreateAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const response = await createAccount(formData);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error en el servidor, intente nuevamente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Crear cuenta</DialogTitle>
            <DialogDescription>
              Complete los campos para crear una nueva cuenta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Tipo de cuenta</Label>
              <RadioGroup name="role" defaultValue="admin">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="superuser" id="superuser" />
                  <Label htmlFor="superuser">Super User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Nombre</Label>
              <Input
                autoComplete="off"
                name="name"
                type="text"
                className="Input"
              />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input
                autoComplete="off"
                name="lastname"
                type="text"
                className="Input"
              />
            </div>
            <div>
              <Label>Telefono</Label>
              <Input
                autoComplete="off"
                name="phone"
                type="number"
                className="Input"
              />
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <Input
                autoComplete="off"
                name="email"
                type="email"
                className="Input"
              />
            </div>
            <div>
              <Label>Password</Label>
              <PasswordInput name="password" />
            </div>
          </div>
          <DialogFooter className="mt-5">
            <LoadingButton
              title="Crear cuenta"
              classname="w-32"
              loading={loading}
              onClick={() => {}}
              type="submit"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-32"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAccountModal;
