"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      className="ml-5 lg:ml-0"
      onClick={() => router.back()}
    >
      <ArrowLeft />
      <span className="ml-2">Seguir comprando</span>
    </Button>
  );
}

export default BackButton;
