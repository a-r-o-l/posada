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
import { StudentFullDetails } from "@/supabase/models/student";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

function CreateChildren({
  open,
  onClose,
  accountId,
  students,
}: {
  open: boolean;
  onClose: () => void;
  accountId: string;
  students?: StudentFullDetails[];
}) {
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");

  const filteredChildren = useMemo(() => {
    if (!students || !students.length) return [];
    if (!searchParam) return students;
    return students.filter((child: StudentFullDetails) => {
      const fullName = `${child?.name} ${child?.lastname}`.toLowerCase();
      return fullName.includes(searchParam.toLowerCase());
    });
  }, [students, searchParam]);

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
                  {filteredChildren.map((child: StudentFullDetails) => (
                    <TableRow key={child.id}>
                      <TableCell>{child?.name}</TableCell>
                      <TableCell>{child?.lastname}</TableCell>
                      <TableCell>{child?.school?.name || ""}</TableCell>
                      <TableCell>{child?.grade?.grade || ""}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          disabled={loading}
                          // onClick={() => handleAddChild(child)}
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
