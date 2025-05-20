"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const [state, setState] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (state === "") {
        if (params.has("year")) {
          const levelValue = params.get("year");
          setState(levelValue || "");
        } else {
          params.delete("year");
        }
      } else if (state) {
        if (state === "all") {
          params.delete("year");
        } else {
          params.set("year", state);
        }
      } else {
        params.delete("year");
      }
      router.push(`${url}?${params.toString()}`);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state, router, url]);

  return (
    <Select value={state} onValueChange={setState}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar año" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Todos</SelectItem>
          {["2024", "2025"].map((year) => (
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
