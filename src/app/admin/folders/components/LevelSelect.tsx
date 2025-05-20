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

function LevelSelect({ url }: { url: string }) {
  const router = useRouter();

  const [state, setState] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (state === "") {
        if (params.has("level")) {
          const levelValue = params.get("level");
          setState(levelValue || "");
        } else {
          params.delete("level");
        }
      } else if (state) {
        if (state === "all") {
          params.delete("level");
        } else {
          params.set("level", state);
        }
      } else {
        params.delete("level");
      }
      router.push(`${url}?${params.toString()}`);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state, router, url]);

  return (
    <Select value={state} onValueChange={setState}>
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
