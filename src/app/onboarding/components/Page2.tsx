import SearchChildrenModal from "@/app/store/account/children/components/SearchChildrenModal";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { School } from "@/supabase/models/school";
import {
  CheckCircle2,
  Circle,
  School as SchoolIcon,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Page2({
  selectedSchool,
  year,
  setYear,
  selectedGrade,
  setSelectedGrade,
  searchParam,
  setSearchParam,
  availableGrades,
  fullGrade,
  children,
  addStudent,
  user,
  setCreateChildrenModal,
  setChildToRemove,
  setOpenAlert,
  mutationLoading,
  deleteProfileStudent,
  fetchProfileStudentsByAccountId,
  openAlert,
  childToRemove,
  createChildrenModal,
}: {
  selectedSchool: string;
  year: string;
  setYear: (year: string) => void;
  selectedGrade: string;
  setSelectedGrade: (gradeId: string) => void;
  searchParam: string;
  setSearchParam: React.Dispatch<React.SetStateAction<string>>;
  availableGrades: { id: string; display_name: string; year: string }[];
  fullGrade: any;
  children: any[];
  addStudent: (student: any) => void;
  user: any;
  setCreateChildrenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChildToRemove: (child: any) => void;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  mutationLoading: boolean;
  deleteProfileStudent: (
    accountId: string,
    studentId: string,
  ) => Promise<{ success: boolean }>;
  fetchProfileStudentsByAccountId: (id: string) => Promise<void>;
  openAlert: boolean;
  childToRemove: any;
  createChildrenModal: boolean;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-10 mt-10">
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
        func={addStudent}
      />
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
    </div>
  );
}

export default Page2;
