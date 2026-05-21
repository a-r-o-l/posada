import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGrades } from "@/supabase/hooks/client/useGrades";
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";
import { useStudents } from "@/supabase/hooks/client/useStudents";
import { School } from "@/supabase/models/school";
import { StudentFullDetails } from "@/supabase/models/student";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const AVAILABLE_YEARS = ["2024", "2025", "2026"];

function CreateChildren({
  open,
  onClose,
  accountId,
  schools,
}: {
  open: boolean;
  onClose: () => void;
  accountId: string;
  schools: School[];
}) {
  const router = useRouter();
  const {
    grades,
    fetchGradesBySchoolIdAndYear,
    loading: loadingGrades,
  } = useGrades();
  const {
    students,
    fetchStudentsByGradeId,
    loading: loadingStudents,
  } = useStudents();
  const { createProfileStudent, mutationLoading } = useProfileStudents();

  const [searchParam, setSearchParam] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const loading = loadingGrades || loadingStudents || mutationLoading;

  const filteredChildren = useMemo(() => {
    if (!selectedGrade) return [];
    if (!students || !students.length) return [];
    if (!searchParam) return students;

    return students.filter((child: StudentFullDetails) => {
      const fullName = `${child?.name} ${child?.lastname}`.toLowerCase();
      return fullName.includes(searchParam.toLowerCase());
    });
  }, [students, searchParam, selectedGrade]);

  const handleAddChild = async (child: StudentFullDetails) => {
    const res = await createProfileStudent({
      profile_id: accountId,
      student_id: child.id,
    });

    if (!res.success) {
      toast.error(res.error || "Error al agregar el menor");
      return;
    }

    toast.success("Menor agregado correctamente");
    onClose();
    router.refresh();
  };

  useEffect(() => {
    if (!open) {
      setSelectedSchool("");
      setSelectedYear("");
      setSelectedGrade("");
      setSearchParam("");
      return;
    }
  }, [open]);

  useEffect(() => {
    setSelectedGrade("");
    setSearchParam("");

    if (!selectedSchool || !selectedYear) return;
    fetchGradesBySchoolIdAndYear(selectedSchool, selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchool, selectedYear]);

  useEffect(() => {
    setSearchParam("");
    if (!selectedGrade) return;
    fetchStudentsByGradeId(selectedGrade);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrade]);

  // const handleAddChild = async (child: IStudentPopulated) => {
  //   try {
  //     setLoading(true);
  //     const res = await addChildToAccount(accountId, child._id);

  //     if (res.success) {
  //       toast.success(res.message);
  //       setLoading(false);
  //       onClose();
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex h-[min(88vh,920px)]  flex-col overflow-hidden p-0 min-w-[800px]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl">Agregar menor</DialogTitle>
          <DialogDescription>
            Selecciona colegio, anio y curso para traer solo los alumnos de ese
            grado.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Colegio
              </Label>
              <Select
                value={selectedSchool}
                onValueChange={(value) => setSelectedSchool(value)}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Selecciona un colegio" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Año
              </Label>
              <Select
                value={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
                disabled={!selectedSchool}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Selecciona un anio" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Curso
              </Label>
              <Select
                value={selectedGrade}
                onValueChange={(value) => setSelectedGrade(value)}
                disabled={!selectedSchool || !selectedYear}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem
                      key={grade.id}
                      value={grade.id}
                      className="truncate"
                    >
                      {grade.display_name} {grade.division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">
              Buscar alumno en el curso seleccionado
            </Label>
            <Input
              autoComplete="off"
              type="text"
              placeholder="Buscar por nombre o apellido"
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              disabled={!selectedGrade}
              className="h-11"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : !selectedGrade ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-500">
              Selecciona colegio, anio y curso para listar alumnos.
            </div>
          ) : (
            <div className="rounded-lg border bg-background">
              <div className="max-h-[42vh] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow>
                      <TableHead className="">Nombre</TableHead>
                      <TableHead className="">Apellido</TableHead>
                      <TableHead className="">Curso</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {filteredChildren.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-sm h-16"
                        >
                          No hay alumnos para mostrar.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredChildren.map((child: StudentFullDetails) => (
                      <TableRow key={child.id}>
                        <TableCell className="whitespace-nowrap font-medium">
                          {child?.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {child?.lastname}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {child?.grade?.display_name ||
                            child?.grade?.grade ||
                            ""}{" "}
                          {child?.grade?.division || ""}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={loading}
                            onClick={() => handleAddChild(child)}
                            className="font-semibold"
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="border-t px-6 py-4">
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
