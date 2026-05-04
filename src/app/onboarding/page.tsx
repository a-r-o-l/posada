"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Info, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import WhatsAppLogo from "@/icons/whatsappsvg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StudentFullDetails } from "@/supabase/models/student";
import { useSchools } from "@/supabase/hooks/client/useSchools";
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";
import { useAuthStore } from "@/zustand/auth-store";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import SearchChildrenModal from "../store/account/children/components/SearchChildrenModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingPage() {
  const router = useRouter();
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
  const [childrenAdded, setChildrenAdded] = useState<StudentFullDetails[] | []>(
    [],
  );

  const addStudent = (student: StudentFullDetails) => {
    if (!children.some((s) => s.id === student.id)) {
      setChildrenAdded((prev) => [...prev, student]);
      toast.success("Menor agregado");
      setCreateChildrenModal(false);
    } else {
      toast.error("El menor ya fue agregado");
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="mb-5">
              <CardTitle className="text-2xl font-bold text-center">
                Bienvenido/a
                <span className="uppercase text-blue-500">
                  {" "}
                  {user?.name} 🎉
                </span>
              </CardTitle>
              <CardDescription className="text-center">
                Ya casi terminamos, solo necesitamos un poco más de información
                para completar tu registro.
              </CardDescription>
            </div>
            <div className="flex w-full justify-center">
              <Alert
                variant="default"
                className="text-blue-500 border-blue-500 flex gap-2 md:w-1/2"
              >
                <div>
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <AlertTitle className="font-bold">Atencion</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc font-semibold mt-4">
                      <li>
                        {" "}
                        Por temas de seguridad y para brindar una mejor
                        experiencia a los usuarios, necesitamos los datos de tus
                        menores a cargo.
                      </li>
                      <li>Sin esta información no podras acceder al sitio.</li>
                      <li>
                        Por cualquier inconveniente ingresa a solicitar ayuda.
                      </li>
                    </ul>
                    <div className="w-full flex justify-end">
                      <a
                        href="https://wa.me/5491154032747?text=Hola!%20Quiero%20hacer%20una%20consulta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-between gap-5 px-4 py-1 transition-all mt-10"
                        style={{ boxShadow: "0 4px 16px #0003" }}
                      >
                        <span className="lg:text-base">Solicitar ayuda</span>
                        <WhatsAppLogo className="w-6 h-6 lg:w-8 lg:h-8" />
                      </a>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulario para agregar estudiantes */}
            {/* <StudentForm schools={schools} onAddStudent={addStudent} /> */}

            {/* Tabla de estudiantes agregados */}
            {/* <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users2 className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold">Estudiantes agregados:</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Escuela</TableHead>
                    <TableHead>Grado</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!students?.length ? (
                    students.map((student, index) => {
                      const school = schools.find(
                        (s) => s.id === student.school_id,
                      );
                      const grade = school?.grades?.find(
                        (g) => g.id === student.grade_id,
                      );
                      return (
                        <TableRow key={student.id || `temp-${index}`}>
                          <TableCell className="capitalize">
                            {student.name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {student.lastname}
                          </TableCell>
                          <TableCell className="capitalize">
                            {school?.name}
                          </TableCell>
                          <TableCell className="uppercase">
                            {grade?.display_name} ({grade?.year})
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStudent(student.id!)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="h-20">
                      <TableCell colSpan={5} className="text-center py-4">
                        No hay estudiantes agregados aún.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex w-full items-center justify-center">
                <Button
                  onClick={handleSave}
                  disabled={saving || !students?.length}
                  className="w-60 rounded-full"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar Estudiantes"}
                </Button>
              </div>
            </div> */}
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
                          <TableCell className="capitalize">
                            {child?.name}
                          </TableCell>
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
                func={addStudent}
              />
            </div>
            <div className="flex items-center justify-center mt-5">
              <Button
                onClick={() => {
                  router.push("/");
                }}
                className="w-60 rounded-full"
                size="lg"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
