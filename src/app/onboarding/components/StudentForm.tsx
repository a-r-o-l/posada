// components/StudentForm.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, UserPlus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { SchoolFullDetails } from "@/supabase/models/school";
import { Student } from "@/supabase/models/student";
import { useStudents } from "@/supabase/hooks/client/useStudents";

interface StudentFormProps {
  schools: SchoolFullDetails[];
  onAddStudent: (student: Partial<Student>) => void;
}

export default function StudentForm({
  schools,
  onAddStudent,
}: StudentFormProps) {
  const { fetchStudentsByGradeId, students } = useStudents();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener grados filtrados por escuela seleccionada
  const availableGrades = useMemo(() => {
    if (!selectedSchool) return [];
    const school = schools.find((s) => s.id === selectedSchool);
    return (
      school?.grades?.sort((a, b) => Number(a.year) - Number(b.year)) || []
    );
  }, [selectedSchool, schools]);

  // Buscar estudiantes cuando cambia el grado o el término de búsqueda
  useEffect(() => {
    if (selectedGrade) {
      fetchStudentsByGradeId(selectedGrade);
    }
  }, [selectedGrade]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) {
      return students;
    }
    return students
      .filter((student) => {
        const fullName = `${student.name} ${student.lastname}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        const nameA = `${a.name} ${a.lastname}`.toLowerCase();
        const nameB = `${b.name} ${b.lastname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  }, [searchTerm, students]);

  const handleAdd = () => {
    if (selectedStudent && selectedSchool && selectedGrade) {
      onAddStudent({
        id: selectedStudent.id, // Incluir el ID
        name: selectedStudent.name,
        lastname: selectedStudent.lastname,
        grade_id: selectedGrade,
        school_id: selectedSchool,
      });
      // Resetear formulario
      setSelectedSchool("");
      setSelectedGrade("");
      setSelectedStudent(null);
      setSearchTerm("");
    }
  };

  const canAdd = selectedStudent && selectedSchool && selectedGrade;

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center gap-2">
        <UserPlus className="h-6 w-6 text-blue-500" />
        <h3 className="font-semibold">Agregar Estudiante</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select de Escuela */}
        <div className="space-y-2">
          <Label>Escuela</Label>
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Seleccionar escuela" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem
                  key={school.id}
                  value={school.id}
                  className="capitalize"
                >
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select de Grado (habilitado solo si hay escuela seleccionada) */}
        <div className="space-y-2">
          <Label>Curso</Label>
          <Select
            value={selectedGrade}
            onValueChange={setSelectedGrade}
            disabled={!selectedSchool}
          >
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              {availableGrades.map((grade) => (
                <SelectItem
                  key={grade.id}
                  value={grade.id}
                  className="uppercase"
                >
                  {grade.display_name} ({grade.year})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Autocompletado de Estudiante */}
        <div className="space-y-2 md:col-span-2 w-full">
          <Label>Buscar Estudiante</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between capitalize"
                disabled={!selectedGrade}
              >
                {selectedStudent
                  ? `${selectedStudent.name} ${selectedStudent.lastname}`
                  : "Buscar estudiante..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0"
              align="start"
              sideOffset={5}
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput
                  placeholder="Buscar por nombre o apellido..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  {searchTerm.trim().length > 0 ? (
                    <>
                      <CommandEmpty>
                        No se encontraron estudiantes.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredStudents.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={`${student.name} ${student.lastname}`}
                            className="capitalize"
                            onSelect={() => {
                              setSelectedStudent(student);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedStudent?.id === student.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {student.name} {student.lastname}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Escribe para buscar estudiantes...
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <Button
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-60 rounded-full"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Estudiante
        </Button>
      </div>
    </div>
  );
}
