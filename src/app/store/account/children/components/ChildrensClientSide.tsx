"use client";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";
import { useSchools } from "@/supabase/hooks/client/useSchools";
import { StudentFullDetails } from "@/supabase/models/student";
import { useAuthStore } from "@/zustand/auth-store";
import React, { useEffect, useMemo, useState } from "react";
import SearchChildrenModal from "./SearchChildrenModal";
import { toast } from "sonner";
import { Trash2, UserPlus, Users } from "lucide-react";

function ChildrensClientSide() {
  const { currentUser: user } = useAuthStore();
  const { fetchProfileStudentsByAccountId, profileStudents } =
    useProfileStudents();
  const { deleteProfileStudent, mutationLoading } = useProfileStudents();

  const [createChildrenModal, setCreateChildrenModal] =
    useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [childToRemove, setChildToRemove] = useState<StudentFullDetails | null>(
    null,
  );
  const [searchParam, setSearchParam] = useState("");
  const { fetchSchools, schools } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [year, setYear] = useState<string>("2026");

  const availableGrades = useMemo(() => {
    if (!selectedSchool) return [];
    const school = schools.find((s) => s.id === selectedSchool);
    const grades =
      school?.grades?.sort((a, b) =>
        a.display_name.localeCompare(b.display_name),
      ) || [];
    return grades.filter((grade) => grade.year === year);
  }, [selectedSchool, schools, year]);

  const children = useMemo(() => {
    if (!profileStudents) return [];
    return profileStudents;
  }, [profileStudents]);

  const fullGrade = useMemo(() => {
    if (!selectedGrade) return null;
    const school = schools.find((s) => s.id === selectedSchool);
    const grade = school?.grades?.find((g) => g.id === selectedGrade);
    return grade || null;
  }, [selectedGrade, availableGrades]);

  useEffect(() => {
    if (user) {
      fetchProfileStudentsByAccountId(user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            <UserPlus className="inline mr-2 w-5 h-5" />
            Agregar un Menor
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Complete el formulario para buscar un menor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-5">
              <div className="space-y-2 w-full">
                <Label className="text-xs md:text-base">Año</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="capitalize w-full text-xs md:text-base">
                    <SelectValue placeholder="Seleccionar Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <Label className="text-xs md:text-base">Escuela</Label>
                <Select
                  value={selectedSchool}
                  onValueChange={setSelectedSchool}
                >
                  <SelectTrigger className="capitalize w-full text-xs md:text-base">
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
              <div className="space-y-2 w-full">
                <Label className="text-xs md:text-base">Curso</Label>
                <Select
                  value={selectedGrade}
                  onValueChange={setSelectedGrade}
                  disabled={!selectedSchool}
                >
                  <SelectTrigger className="capitalize w-full text-xs md:text-base">
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
            </div>
            <div className="flex items-center justify-between gap-5">
              <div className="space-y-2 md:col-span-2 w-full">
                <Label className="text-xs md:text-base">
                  Buscar Estudiante
                </Label>
                <Input
                  value={searchParam}
                  onChange={(val) => setSearchParam(val.target.value)}
                  className="text-xs md:text-base"
                />
              </div>
              <div>
                <Button
                  className="mt-6"
                  onClick={() => setCreateChildrenModal(true)}
                  disabled={!fullGrade || !searchParam}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            <Users className="inline mr-2 w-5 h-5" />
            Mis Menores
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Lista de mi menores registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-xs md:text-base">
            <TableHeader>
              <TableRow>
                <TableHead>Colegio</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children?.map(({ student: child }) => (
                <TableRow key={child?.display_name}>
                  <TableCell className="capitalize">
                    {child?.school?.name}
                  </TableCell>
                  <TableCell className="capitalize">
                    {child?.grade?.display_name}
                  </TableCell>
                  <TableCell className="capitalize">{child?.name}</TableCell>
                  <TableCell className="capitalize">
                    {child?.lastname}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={async () => {
                        if (!child) {
                          return;
                        }
                        setChildToRemove(child);
                        setOpenAlert(true);
                      }}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={4}>No hay menores</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CustomAlertDialog
          title="Estas seguro de eliminar el menor?"
          description="Esta accion no se puede deshacer"
          open={openAlert}
          loading={mutationLoading}
          onClose={() => {
            setOpenAlert(false);
            setChildToRemove(null);
          }}
          onAccept={async () => {
            if (!user || !childToRemove) {
              toast.error("No se pudo eliminar el menor");
              return;
            }
            const { success } = await deleteProfileStudent(
              user.id || "",
              childToRemove?.id || "",
            );
            if (success) {
              fetchProfileStudentsByAccountId(user?.id || "");
              setOpenAlert(false);
              setChildToRemove(null);
            }
          }}
        />
      </Card>
      <SearchChildrenModal
        grade={fullGrade}
        open={createChildrenModal}
        searchParam={searchParam}
        setOpen={setCreateChildrenModal}
        setSearchParam={setSearchParam}
        onUpdate={fetchProfileStudentsByAccountId}
        accountId={user?.id || ""}
      />
    </div>
  );
}

export default ChildrensClientSide;
