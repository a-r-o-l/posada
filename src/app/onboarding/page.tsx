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
import { Trash2, Users, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StudentFullDetails } from "@/supabase/models/student";
import { useSchools } from "@/supabase/hooks/client/useSchools";
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";
import { useAuthStore } from "@/zustand/auth-store";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import Page1 from "./components/Page1";
import StepIndicator from "./components/StepIndicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/supabase/hooks/client/useProfile";

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser: user } = useAuthStore();
  const {
    fetchProfileStudentsByAccountId,
    profileStudents,
    createProfileStudents,
    mutationLoading,
  } = useProfileStudents();
  const { updateProfile } = useProfile();
  const [createChildrenModal, setCreateChildrenModal] =
    useState<boolean>(false);
  const [searchParam, setSearchParam] = useState("");
  const { fetchSchools, schools } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [year, setYear] = useState<string>("2026");
  const [page, setPage] = useState(0);
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

  const fullSchool = useMemo(() => {
    if (!selectedSchool) return null;
    const school = schools.find((s) => s.id === selectedSchool);
    return school || null;
  }, [schools, selectedSchool]);

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

  if (page === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="mb-5">
                <CardTitle className="text-2xl md:text-3xl font-bold text-center flex gap-2">
                  <span>¡Bienvenido</span>
                  <span className="text-blue-600 dark:text-blue-400 capitalize">
                    {user?.name} 🎉
                  </span>
                </CardTitle>

                <CardDescription className="text-center space-y-4 mt-4">
                  {/* Texto principal */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    Gracias por confiar en nosotros. Para garantizar la
                    seguridad y privacidad de sus hijos, cada colegio tiene
                    acceso independiente.
                  </p>

                  {/* Sección de información importante */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 text-lg">🔒</span>
                      <div className="text-left">
                        <p className="text-xs md:text-sm font-semibold text-blue-800 dark:text-blue-300">
                          ¿Por qué necesitamos esta información?
                        </p>
                        <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Por seguridad, solo podrás ver y comprar fotos del
                          colegio seleccionado.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Instrucciones claras */}
                  <div className="text-left bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      📚 ¿Qué debes hacer?
                    </p>
                    <ul className="text-xs md:text-sm text-gray-600 dark:text-gray-300 space-y-1.5 list-disc list-inside">
                      <li>Selecciona el colegio</li>
                      <li>
                        Luego seleccionarás los cursos y nombres de tus hijos
                      </li>
                      <li className="text-blue-600 dark:text-blue-400 font-medium">
                        Podrás modificar estas preferencias desde
                        <span className="font-black"> Mi Cuenta</span> en
                        cualquier momento
                      </li>
                    </ul>
                  </div>
                  <StepIndicator currentStep={page} setStep={setPage} />
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex w-full justify-center"></div>
              <div className="flex items-center justify-center mt-5">
                <Button
                  onClick={() => setPage(1)}
                  className="w-60 rounded-full"
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <StepIndicator currentStep={page} setStep={setPage} />
          <Page1
            schools={schools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
          />
          <div className="flex items-center justify-center mt-5">
            <Button
              onClick={() => setPage(2)}
              className="w-60 rounded-full"
              disabled={!selectedSchool}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <StepIndicator currentStep={page} setStep={setPage} />
        <div className="flex flex-col gap-10 mt-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Busca y Agrega a tus Hijos/as
            </h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-base">
                <UserPlus className="inline mr-2 w-5 h-5" />
                Agrega tu Hijo/a
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Completa el formulario para buscar y agregar tu hijo/a
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex w-full items-center justify-center md:justify-normal">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border">
                    <AvatarImage
                      src={fullSchool?.image_url || "/placeholderimg.jpg"}
                      alt={fullSchool?.name}
                      className="object-contain p-2"
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-500 text-lg font-semibold">
                      {fullSchool?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-5">
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
                        <ScrollArea className="h-[250px]">
                          {availableGrades.map((grade) => (
                            <SelectItem
                              key={grade.id}
                              value={grade.id}
                              className="uppercase"
                            >
                              {grade.display_name} ({grade.year})
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <div className="space-y-2 md:col-span-2 w-full">
                    <Label className="text-xs md:text-base">
                      Buscar por nombre o apellido
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
                      disabled={!fullGrade || !searchParam || mutationLoading}
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
                Tus Hijos/as
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Lista de hijos/as registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="text-xs md:text-base">
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {childrenAdded.length ? (
                    childrenAdded?.map((child) => (
                      <TableRow key={child?.display_name}>
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
                              setChildrenAdded((prev) =>
                                prev.filter((c) => c.id !== child.id),
                              );
                            }}
                          >
                            <Trash2 className="text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-20 text-center">
                        No hay menores
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
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
          <div className="flex flex-col items-center justify-center gap-5">
            <Button
              onClick={async () => {
                if (!user) {
                  toast.error("Usuario no encontrado");
                  return;
                }
                if (!childrenAdded.length) {
                  toast.error("Agrega al menos un menor");
                  return;
                }
                const resMap = childrenAdded.map((child) => ({
                  profile_id: user.id,
                  student_id: child.id,
                }));

                const { success } = await createProfileStudents(resMap);
                if (success) {
                  const { success } = await updateProfile({
                    schools: !!fullSchool?.id ? [fullSchool?.id] : undefined,
                    id: user.id,
                  });
                  if (!success) {
                    toast.error(
                      "Error al guardar preferencias, intente nuevamente",
                    );
                    return;
                  }
                  toast.success("Preferencias guardadas correctamente");
                  router.push("/store");
                } else {
                  toast.error(
                    "Error al guardar preferencias, intente nuevamente",
                  );
                  return;
                }
              }}
              className="w-60 rounded-full"
              size="lg"
              disabled={!childrenAdded.length || mutationLoading}
            >
              {mutationLoading && (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              )}
              Guardar Preferencias
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
