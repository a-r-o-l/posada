"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/zustand/auth-store";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import { User } from "lucide-react";

function MyAccountClientSide() {
  const { currentUser: user } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-muted-foreground">No hay cuenta</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <User className="inline mr-2 w-5 h-5" />
          Mi Cuenta
        </CardTitle>
        <CardDescription>Informacion de mi cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={user?.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Apellido</Label>
            <Input value={user?.lastname} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email} readOnly />
          </div>
          <div className="space-y-2 flex w-full justify-end">
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Cambiar mi Contraseña
            </Button>
          </div>
        </div>
      </CardContent>
      <ChangePasswordModal open={open} setOpen={setOpen} />
    </Card>
  );
}

export default MyAccountClientSide;
