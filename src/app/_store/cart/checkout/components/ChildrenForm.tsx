"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Button } from "@/components/ui/button";

function ChildrenForm() {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <CardTitle>Datos De su hijo/a</CardTitle>
        <CardDescription>
          Complete los datos de su hijo/a para facilitar la entrega
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="w-1/2 flex flex-col gap-5">
          <div className="flex items-center">
            <Label className="w-60">Curso</Label>
            <Input type="text" />
          </div>
          <div className="flex items-center">
            <Label className="w-60">Nombre completo</Label>
            <Input type="text" />
          </div>
          <Button>Guardar</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChildrenForm;
