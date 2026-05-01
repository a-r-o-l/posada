"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";

function PicturesClient() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Fotos</CardTitle>
        <CardDescription>
          Descargas disponibles de tus fotos compradas.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default PicturesClient;
