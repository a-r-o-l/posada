import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { nameParser } from "@/lib/utilsFunctions";
import { IGrade } from "@/models/Grade";
import { Check, ChevronDown } from "lucide-react";
import React from "react";

function GradeSelect({
  grades,
  state,
  setState,
  disabled,
}: {
  grades: IGrade[];
  state: string[];
  setState: React.Dispatch<React.SetStateAction<string[]>>;
  disabled: boolean;
}) {
  const getGradeName = (gradeId: string) => {
    const grade = grades.find((grade) => grade._id === gradeId);
    return grade ? nameParser(`${grade.grade} ${grade?.division}`) : "";
  };

  if (disabled) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description">Cursos</Label>
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {state.length > 0
              ? state.length === grades.length
                ? "Todos"
                : state
                    .map((gradeId) => getGradeName(gradeId).trim())
                    .join(" - ")
              : "Seleccionar cursos"}
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandList className="w-full">
              <CommandEmpty>No se encontro ningun curso.</CommandEmpty>
              <CommandGroup className="w-[400px]">
                <CommandItem
                  value="todos"
                  onSelect={() => {
                    if (state.length === grades.length) {
                      setState([]);
                      return;
                    }
                    setState(grades.map((grade) => grade._id));
                  }}
                  className="hover:cursor-pointer"
                >
                  Todos
                </CommandItem>
                {grades.map((grade) => (
                  <CommandItem
                    value={grade._id}
                    key={grade._id}
                    onSelect={() => {
                      if (state.includes(grade._id)) {
                        setState(state.filter((v) => v !== grade._id));
                        return;
                      }
                      setState([...state, grade._id]);
                    }}
                    className="hover:cursor-pointer"
                  >
                    {nameParser(`${grade.grade} ${grade?.division}`)}
                    <Check
                      className={cn(
                        "ml-auto",
                        state.includes(grade._id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default GradeSelect;
