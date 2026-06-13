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
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { School } from "@/supabase/models/school";

function SchoolPasswordModal({
  school,
  open,
  onClose,
  onAccess,
}: {
  school: School;
  open: boolean;
  onClose: () => void;
  onAccess: () => void;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    const pswrd = school.password;
    if (school.id === "2f5cf1c9-65ab-4f8d-87a5-20cdb73382a9") {
      if (
        password?.toLowerCase() === "bds3035" ||
        password?.toLowerCase() === "bds3036"
      ) {
        onAccess();
        onClose();
      } else {
        toast.error("Contraseña incorrecta, intenta nuevamente.");
      }
    } else {
      if (pswrd?.toLowerCase() === password?.toLowerCase()) {
        onAccess();
        onClose();
      } else {
        toast.error("Contraseña incorrecta, intenta nuevamente.");
      }
    }
  };

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
            Debe ingresar la contraseña que le envió el colegio para poder
            acceder.
          </SchoolDialogDescription>
        </SchoolDialogHeader>
        <div className="space-y-2 mt-5">
          <Label>Password</Label>
          <Input
            autoFocus
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit();
              }
            }}
          />
          <SchoolDialogFooter>
            <div className="flex justify-end gap-5 w-full mt-10">
              <Button
                className="w-32"
                onClick={() => {
                  onSubmit();
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
