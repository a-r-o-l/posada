import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSchools } from "@/supabase/hooks/client/useSchools";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudents } from "@/supabase/hooks/client/useStudents";
import { Student, StudentFullDetails } from "@/supabase/models/student";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function CreateChildren({
  open,
  onClose,
  accountId,
  onChildAdded,
}: {
  open: boolean;
  onClose: () => void;
  accountId: string;
  onChildAdded?: (child: StudentFullDetails) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const { fetchSchools, schools } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const { fetchStudentsByGradeId, students } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openPop, setOpenPop] = useState(false);

  const filteredStudents = useMemo(() => {
    // Si no hay búsqueda o students no es un array, devolver students (o array vacío)
    if (!searchParam || !Array.isArray(students)) {
      return students || [];
    }

    const searchLower = searchParam.toLowerCase();

    return students
      .filter((student) => {
        // Verificar que student existe y tiene name/lastname como strings
        if (
          !student ||
          typeof student.name !== "string" ||
          typeof student.lastname !== "string"
        ) {
          return false;
        }
        const fullName = `${student.name} ${student.lastname}`.toLowerCase();
        return fullName.includes(searchLower);
      })
      .sort((a, b) => {
        // Después del filtro, a y b deberían ser válidos, pero por seguridad:
        const nameA = `${a.name} ${a.lastname}`.toLowerCase();
        const nameB = `${b.name} ${b.lastname}`.toLowerCase();

        // Protección adicional (no debería ser necesaria, pero evita errores inesperados)
        if (typeof nameA !== "string") return 1;
        if (typeof nameB !== "string") return -1;
        return nameA.localeCompare(nameB);
      });
  }, [searchParam, students]);

  const availableGrades = useMemo(() => {
    if (!selectedSchool) return [];
    const school = schools.find((s) => s.id === selectedSchool);
    return (
      school?.grades?.sort((a, b) => Number(a.year) - Number(b.year)) || []
    );
  }, [selectedSchool, schools]);

  // const handleAddChild = async (child: Student) => {
  //   try {
  //     setLoading(true);
  //     const res = await addChildToAccount(accountId, child.id);

  //     if (res.success) {
  //       toast.success(res.message);
  //       onChildAdded?.(child);
  //       setLoading(false);
  //       onClose();
  //       router.refresh();
  //     } else {
  //       toast.error(res.message || "Error al agregar el menor");
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error adding child:", error);
  //     toast.error("Error inesperado");
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (selectedGrade) {
      fetchStudentsByGradeId(selectedGrade);
    }
  }, [selectedGrade]);

  useEffect(() => {
    fetchSchools();
  }, []);

  // Reset states when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedSchool("");
      setSelectedGrade("");
      setSelectedStudent(null);
      setSearchParam("");
      setOpenPop(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Agregar Menor</DialogTitle>
          <DialogDescription>
            Selecciona la escuela, curso y busca al estudiante que deseas
            agregar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Escuela</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="capitalize w-full">
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
          <div className="space-y-2">
            <Label>Curso</Label>
            <Select
              value={selectedGrade}
              onValueChange={setSelectedGrade}
              disabled={!selectedSchool}
            >
              <SelectTrigger className="capitalize w-full">
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
          <div className="space-y-2 md:col-span-2 w-full">
            <Label>Buscar Estudiante</Label>
            <Popover
              open={openPop}
              onOpenChange={setOpenPop}
              modal={true} // Add this prop
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPop}
                  className="w-full justify-between capitalize"
                  disabled={!selectedGrade}
                  type="button"
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
                onOpenAutoFocus={(e) => {
                  // Prevent auto-focus when popover opens
                  e.preventDefault();
                }}
              >
                <Command>
                  <CommandInput
                    placeholder="Buscar por nombre o apellido..."
                    value={searchParam}
                    onValueChange={setSearchParam}
                    autoFocus={false}
                  />
                  <CommandList>
                    {searchParam.trim().length > 0 ? (
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
                                setOpenPop(false);
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
          {selectedStudent && !loading && (
            <div className="flex justify-center">
              <Button
                type="button"
                // onClick={() => handleAddChild(selectedStudent)}
                className="w-full"
              >
                Agregar Estudiante
              </Button>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          )}
        </div>
        <DialogFooter className="mt-5">
          <div className="flex w-full justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-32"
            >
              Cerrar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChildren;
