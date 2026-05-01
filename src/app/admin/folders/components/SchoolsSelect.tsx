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
import Image from "next/image";
import { School } from "@/supabase/models/school";

function SchoolsSelect({ url, schools }: { url: string; schools: School[] }) {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 Leemos los parámetros actuales

  // 👇 Inicializamos el estado con el valor actual de "school" en la URL
  const [state, setState] = useState(searchParams.get("school") || "");

  const handleValueChange = (newValue: string) => {
    setState(newValue);

    // Construimos los nuevos parámetros
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === "" || newValue === "all") {
      params.delete("school");
    } else {
      params.set("school", newValue);
    }

    // Navegamos a la nueva URL
    router.push(`${url}?${params.toString()}`);
  };

  return (
    <Select value={state} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar colegio" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {!!schools.length ? (
            schools.map((school) => (
              <SelectItem key={school.id} value={school.id!}>
                <div className="flex items-center justify-between flex-row gap-2 py-3">
                  <Image
                    src={school?.image_url || "/placeholderimg.jpg"}
                    alt={school.name!}
                    width={50}
                    height={50}
                    className="rounded-full w-5 h-5"
                  />
                  <span>{school.name}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="all">No hay colegios</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SchoolsSelect;
