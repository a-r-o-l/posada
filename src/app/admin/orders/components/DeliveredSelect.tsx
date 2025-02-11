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

function DeliveredSelect({ url }: { url: string }) {
  const router = useRouter();

  const [state, setState] = useState("all");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (state === "all") {
        params.delete("delivered");
      } else if (state) {
        params.set("delivered", state);
      } else {
        params.delete("delivered");
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
          <SelectItem value="delivered">Entregados</SelectItem>
          <SelectItem value="pending">Pendientes</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default DeliveredSelect;
