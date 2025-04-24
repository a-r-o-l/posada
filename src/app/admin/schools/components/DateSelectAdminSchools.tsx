import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function DateSelectAdminSchools({ url }: { url: string }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.delete("grade");
      if (!year) {
        params.set("year", "2025");
      } else {
        params.set("year", year);
      }
      router.push(`${url}?${params.toString()}`);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [router, url, year]);

  return (
    <div className="w-full flex justify-center items-end mb-5 lg:justify-start">
      <div className="w-96 px-5 text-center">
        <Label>Seleccione el año</Label>
        <div className="flex items-center gap-2">
          <Calendar size={24} />
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="border-[#139FDC] border-2">
              <SelectValue>{year}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default DateSelectAdminSchools;
