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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IStudentPopulated, PartialStudent } from "@/models/Student";
import { addChildToAccount } from "@/server/accountAction";
import { getAllStudents } from "@/server/studentAction";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function CreateChildren({
  open,
  onClose,
  accountId,
}: {
  open: boolean;
  onClose: () => void;
  accountId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [searchParam, setSearchParam] = useState("");

  const filteredChildren = useMemo(() => {
    if (!searchParam) return children;
    return children.filter((child: PartialStudent) => {
      const fullName = `${child.name} ${child.lastname}`.toLowerCase();
      return fullName.includes(searchParam.toLowerCase());
    });
  }, [children, searchParam]);

  useEffect(() => {
    if (open) {
      const getStudents = async () => {
        const { students, success } = await getAllStudents();
        if (success) {
          setChildren(students);
        } else {
          console.error("Error fetching students");
        }
      };
      getStudents();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menores</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <Label>Buscar alumno</Label>
            <Input
              autoComplete="off"
              type="text"
              placeholder="Buscar por nombre o apellido"
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Colegio</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChildren.map((child: IStudentPopulated) => (
                    <TableRow key={child._id}>
                      <TableCell>{child.name}</TableCell>
                      <TableCell>{child.lastname}</TableCell>
                      <TableCell>{child?.schoolId?.name || ""}</TableCell>
                      <TableCell>{child?.gradeId?.grade || ""}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          disabled={loading}
                          onClick={async () => {
                            setLoading(true);
                            const res = await addChildToAccount(
                              accountId,
                              child._id
                            );
                            if (res.success) {
                              toast.success(res.message);
                              setLoading(false);
                              onClose();
                              // Primero hacemos el refresh
                              router.refresh();
                              // Esperamos un tick para asegurar que los datos se actualizaron
                              setTimeout(() => {
                                router.replace("/admin/accounts");
                              }, 0);
                            } else {
                              toast.error(
                                res.message || "Error al agregar el menor"
                              );
                              setLoading(false);
                            }
                          }}
                        >
                          agregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
