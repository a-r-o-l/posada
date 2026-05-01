import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";
import { useStudents } from "@/supabase/hooks/client/useStudents";
import { Grade } from "@/supabase/models/grade";
import { StudentFullDetails } from "@/supabase/models/student";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function SearchChildrenModal({
  open,
  setOpen,
  grade,
  searchParam,
  setSearchParam,
  onUpdate,
  accountId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  grade: Grade | null;
  searchParam: string;
  setSearchParam: React.Dispatch<React.SetStateAction<string>>;
  onUpdate: (id: string) => Promise<void>;
  accountId: string;
}) {
  const { fetchStudentsByGradeIdAndFullName, students, loading } =
    useStudents();
  const { createProfileStudent, mutationLoading } = useProfileStudents();
  const [selectedStudent, setSelectedStudent] =
    useState<null | StudentFullDetails>(null);

  useEffect(() => {
    if (grade && searchParam !== undefined && open) {
      fetchStudentsByGradeIdAndFullName(grade.id, searchParam);
    }
  }, [grade, searchParam, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setSelectedStudent(null);
        setOpen(val);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar Alumnos</DialogTitle>
          <DialogDescription>
            Seleccione su menor a cargo de la lista
          </DialogDescription>
        </DialogHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Curso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-60"
                    align="center"
                  >
                    <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : !!students?.length ? (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>
                      <Checkbox checked={selectedStudent?.id === student.id} />
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.lastname}</TableCell>
                    <TableCell>{student.grade?.display_name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-40"
                    align="center"
                  >
                    No se encontraron estudiantes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedStudent(null);
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="ml-2"
                onClick={async () => {
                  if (!selectedStudent) {
                    toast.error("Debe seleccionar un estudiante");
                    return;
                  }
                  const { success } = await createProfileStudent({
                    student_id: selectedStudent.id,
                    profile_id: accountId,
                  });
                  if (success) {
                    toast.success("Estudiante agregado a su cuenta");
                    setSearchParam("");
                    await onUpdate(accountId);
                    setOpen(false);
                  } else {
                    toast.error(
                      "Error al agregar el estudiante a su cuenta, intente nuevamente.",
                    );
                  }
                }}
                disabled={!selectedStudent || mutationLoading}
              >
                {mutationLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Agregar a mi cuenta"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchChildrenModal;
