"use client";
import LoadingButton from "@/components/LoadingButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { IAccount } from "@/models/Account";
import { IGrade } from "@/models/Grade";
import { ISchool } from "@/models/School";
import { updateChildren } from "@/server/accountAction";
import { Info, Save, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import NeedHelpModal from "./NeedHelpModal";
import WhatsAppLogo from "@/icons/whatsappsvg";

interface Child {
  name: string;
  lastname: string;
  grade: IGrade | null;
  school: ISchool | null;
}

function ExtraUserDataForm({
  user,
  schools,
  grades,
}: {
  user: IAccount;
  schools: ISchool[];
  grades: IGrade[];
}) {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [newChildName, setNewChildName] = useState("");
  const [newChildLastname, setNewChildLastname] = useState("");
  const [newChildSchool, setNewChildSchool] = useState<ISchool | null>(null);
  const [newChildGrade, setNewChildGrade] = useState<IGrade | null>(null);
  const [loading, setLoading] = useState(false);
  const [needHelp, setNeedHelp] = useState(false);

  const addChild = () => {
    if (newChildName.trim() && newChildLastname.trim()) {
      setChildren([
        ...children,
        {
          name: newChildName.trim(),
          lastname: newChildLastname.trim(),
          grade: newChildGrade,
          school: newChildSchool,
        },
      ]);
      setNewChildName("");
      setNewChildLastname("");
      setNewChildGrade(null);
      setNewChildSchool(null);
    }
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (newChildSchool?._id) {
        params.set("school", newChildSchool._id);
      } else {
        params.delete("school");
      }
      router.push(`/signup/extradata?${params.toString()}`);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [newChildSchool, router]);

  const saveData = async () => {
    setLoading(true);
    try {
      const mappedChildren = children.map((child) => ({
        name: child.name,
        lastname: child.lastname,
        gradeId: child.grade?._id,
        schoolId: child.school?._id,
      }));
      const formData = new FormData();
      formData.append("children", JSON.stringify(mappedChildren));
      const res = await updateChildren(user._id, formData);
      if (res.success) {
        toast.success("Registro completado, ya puedes iniciar sesión.");
        setLoading(false);
        router.push("/signin");
      } else {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error en el servidor, intenta de nuevo.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-5">
          <CardTitle className="text-2xl font-bold text-center">
            Bienvenido/a {user.name}! 🎉
          </CardTitle>
          <CardDescription className="text-center">
            Ya casi terminamos, solo necesitamos un poco más de información para
            completar tu registro.
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
              <AlertTitle>Atencion</AlertTitle>
              <AlertDescription>
                <ul className="list-disc">
                  <li>
                    {" "}
                    Por temas de seguridad y para brindar una mejor experiencia
                    a los usuarios, necesitamos los datos de tus menores a
                    cargo.
                  </li>
                  <li>Sin esta informacion no podras acceder al sitio.</li>
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
      <CardContent className="flex gap-10 flex-col md:flex-row mt-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Agregar un menor</CardTitle>
            <CardDescription>
              Ingresa la informacion de tus menores a cargo, los datos deben ser
              exactos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label>Colegio</Label>
              <Select
                value={newChildSchool ? newChildSchool._id : ""}
                onValueChange={(value) => {
                  const selectedSchool = schools.find(
                    (school) => school._id === value
                  );
                  setNewChildSchool(selectedSchool ? selectedSchool : null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar colegio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {schools.length
                        ? "Seleccionar colegio"
                        : "No hay colegios"}
                    </SelectLabel>
                    {schools.map((school) => (
                      <SelectItem key={school._id} value={school._id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Curso</Label>
              <Select
                value={newChildGrade ? newChildGrade._id : ""}
                onValueChange={(value) => {
                  const selectedGrade = grades.find(
                    (grade) => grade._id === value
                  );
                  setNewChildGrade(selectedGrade ? selectedGrade : null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {grades.length ? "Seleccionar curso" : "No hay cursos"}
                    </SelectLabel>
                    {grades.map((grade) => (
                      <SelectItem key={grade._id} value={grade._id}>
                        {grade.grade} {grade.division}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input
                value={newChildLastname}
                onChange={(e) => setNewChildLastname(e.target.value)}
              />
            </div>

            <Button
              onClick={addChild}
              disabled={
                !newChildSchool ||
                !newChildGrade ||
                !newChildName ||
                !newChildLastname
              }
            >
              <UserPlus className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Menores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Colegio</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead className="w-[100px]">Año</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!!children?.length ? (
                  children.map((child, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{child.name}</TableCell>
                        <TableCell>{child.lastname}</TableCell>
                        <TableCell>{child?.school?.name}</TableCell>
                        <TableCell>
                          {child?.grade?.grade} {child.grade?.division}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChild(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-40 text-muted-foreground"
                    >
                      No hay menores registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <div className="flex flex-col gap-10 w-full sm:flex-row sm:justify-end">
          <LoadingButton
            loading={loading}
            title="Finalizar registro"
            variant="default"
            onClick={saveData}
            disabled={!children.length}
            classname="w-full sm:w-40"
          >
            <Save />
          </LoadingButton>

          <Button
            variant="link"
            className="w-full sm:w-40"
            onClick={() => {
              router.push("/");
            }}
          >
            Salir
          </Button>
        </div>
      </CardFooter>
      <NeedHelpModal
        open={needHelp}
        onClose={() => setNeedHelp(false)}
        user={user}
      />
    </Card>
  );
}

export default ExtraUserDataForm;
