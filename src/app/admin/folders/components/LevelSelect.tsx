"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // 👈 Importa useSearchParams
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LevelSelect({ url }: { url: string }) {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 Lee los params directamente
  const [state, setState] = useState(searchParams.get("level") || ""); // 👈 Inicializa desde URL

  const handleValueChange = (newValue: string) => {
    setState(newValue);

    // Construir nueva URL
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === "" || newValue === "all") {
      params.delete("level");
    } else {
      params.set("level", newValue);
    }

    // Navegar
    router.push(`${url}?${params.toString()}`);
  };

  return (
    <Select value={state} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar nivel" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Todos</SelectItem>
          {["jardin", "primaria", "secundaria", "eventos"].map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default LevelSelect;
