"use client";
import { useEffect, useState } from "react";
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
import { Trash2, Save, Info, Users2 } from "lucide-react";
import { toast } from "sonner";
import StudentForm from "./components/StudentForm";
import WhatsAppLogo from "@/icons/whatsappsvg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Student } from "@/supabase/models/student";
import { useSchools } from "@/supabase/hooks/client/useSchools";
import { useUser } from "@/hooks/use-user";
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";

export default function OnboardingPage() {
  const router = useRouter();
  const { schools, fetchSchools, loading } = useSchools();
  const { user, logout } = useUser();

  console.log("user ", user);
  const { createProfileStudents } = useProfileStudents();
  const [students, setStudents] = useState<Partial<Student>[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const addStudent = (student: Partial<Student>) => {
    // Asegurarse de que el estudiante tiene un ID
    if (!student.id) {
      toast.error("Error: El estudiante no tiene ID");
      return;
    }

    if (students.some((s) => s.id === student.id)) {
      toast.error("Este estudiante ya fue agregado");
      return;
    }

    setStudents([...students, { ...student }]);
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    if (students.length === 0) {
      toast.error("Debes agregar al menos un estudiante");
      return;
    }
    setSaving(true);
    try {
      const studentsToInsert = students.map((student) => ({
        profile_id: user?.id,
        student_id: student.id!,
      }));
      const { error } = await createProfileStudents(studentsToInsert);
      if (error) {
        toast.error(error || "Error al guardar los estudiantes");
        return;
      }
      toast.success("Menores registrados correctamente en la cuenta");
      router.push("/store");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar los estudiantes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

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
            <StudentForm schools={schools} onAddStudent={addStudent} />

            {/* Tabla de estudiantes agregados */}
            <div className="space-y-4 border rounded-lg p-4">
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
            </div>
            <div className="flex items-center justify-center mt-5">
              <Button
                onClick={logout}
                disabled={saving}
                className="w-60 rounded-full"
                size="lg"
              >
                Cerrar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
