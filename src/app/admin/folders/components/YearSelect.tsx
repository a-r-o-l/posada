"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // 👈 Importamos useSearchParams
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function YearSelect({ url }: { url: string }) {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 Leemos los parámetros actuales

  // 👇 Inicializamos el estado con el valor actual de "year" en la URL
  const [state, setState] = useState(searchParams.get("year") || "");

  const handleValueChange = (newValue: string) => {
    setState(newValue);

    // Construimos los nuevos parámetros
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === "" || newValue === "all") {
      params.delete("year");
    } else {
      params.set("year", newValue);
    }

    // Navegamos a la nueva URL
    router.push(`${url}?${params.toString()}`);
  };

  return (
    <Select value={state} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar año" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Todos</SelectItem>
          {["2024", "2025", "2026"].map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default YearSelect;
