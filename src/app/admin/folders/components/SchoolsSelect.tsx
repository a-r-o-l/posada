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
import { PartialSchool } from "@/models/School";
import Image from "next/image";

function SchoolsSelect({
  url,
  schools,
}: {
  url: string;
  schools: PartialSchool[];
}) {
  const router = useRouter();

  const [state, setState] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (state === "" || state === "all") {
        if (params.has("school")) {
          const schoolId = params.get("school");
          setState(schoolId || "");
        } else {
          params.delete("school");
        }
      } else if (state) {
        params.set("school", state);
      } else {
        params.delete("school");
      }
      router.push(`${url}?${params.toString()}`);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [state, router, url]);

  return (
    <Select value={state} onValueChange={(e) => setState(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccionar colegio" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {!!schools.length ? (
            schools.map((school) => (
              <SelectItem key={school._id} value={school._id!}>
                <div className="flex items-center justify-between flex-row gap-2 py-3">
                  <Image
                    src={school?.imageUrl || "/placeholderimg.jpg"}
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
