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

function StateSelect({ url }: { url: string }) {
  const router = useRouter();

  const [state, setState] = useState("all");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (state === "all") {
        params.delete("state");
      } else if (state) {
        params.set("state", state);
      } else {
        params.delete("state");
      }
      router.push(`${url}?${params.toString()}`);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state, router, url]);

  return (
    <Select value={state} onValueChange={(e) => setState(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="approved">Pagado</SelectItem>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="failed">Fallado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default StateSelect;
