"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addMonths, format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";

function DatePicker({ url }: { url: string }) {
  const router = useRouter();

  const [date, setDate] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (date?.from) {
        params.set("start", date.from.toISOString().split("T")[0]);
      } else {
        params.delete("start");
      }
      if (date?.to) {
        params.set("end", date.to.toISOString().split("T")[0]);
      } else {
        params.delete("end");
      }
      router.push(`${url}?${params.toString()}`);
      // router.push(`/dashboard?${params.toString()}`);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [date, router, url]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y", { locale: es })} /{" "}
                {format(date.to, "LLL dd, y", { locale: es })}
              </>
            ) : (
              format(date.from, "LLL dd, y", { locale: es })
            )
          ) : (
            <span>Selecciona fechas</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={3}
          locale={es}
        />
        {date && (
          <div className="p-2">
            <Button
              onClick={() => setDate(undefined)}
              variant="outline"
              size="sm"
            >
              Limpiar
              <X />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
