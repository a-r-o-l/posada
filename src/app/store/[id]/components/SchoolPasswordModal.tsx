"use client";
import { Button } from "@/components/ui/button";
import {
  SchoolDialog,
  SchoolDialogContent,
  SchoolDialogDescription,
  SchoolDialogFooter,
  SchoolDialogHeader,
  SchoolDialogTitle,
} from "@/components/edited/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nameParser } from "@/lib/utilsFunctions";
import { ISchool } from "@/models/School";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function SchoolPasswordModal({
  school,
  open,
  onClose,
  onAccess,
}: {
  school: ISchool;
  open: boolean;
  onClose: () => void;
  onAccess: () => void;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");

  return (
    <SchoolDialog open={open} onOpenChange={onClose}>
      <SchoolDialogContent
        onOpenAutoFocus={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <SchoolDialogHeader>
          <SchoolDialogTitle>{nameParser(school.name)}</SchoolDialogTitle>
          <SchoolDialogDescription>
            Debe ingresar la contraseña para acceder a esta escuela
          </SchoolDialogDescription>
        </SchoolDialogHeader>
        <div className="space-y-2 mt-5">
          <Label>Password</Label>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <SchoolDialogFooter>
            <div className="flex justify-end gap-5 w-full mt-10">
              <Button
                className="w-32"
                onClick={() => {
                  const pswrd = school.password;
                  if (pswrd === password) {
                    onAccess();
                    onClose();
                  } else {
                    toast.error("Contraseña incorrecta, intenta nuevamente.");
                  }
                }}
              >
                Entrar
              </Button>
              <Button
                className="w-32"
                onClick={() => {
                  onClose();
                  router.push("/store");
                }}
              >
                <ArrowLeft />
                Volver
              </Button>
            </div>
          </SchoolDialogFooter>
        </div>
      </SchoolDialogContent>
    </SchoolDialog>
  );
}

export default SchoolPasswordModal;
