"use client";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createManyStudents } from "@/server/studentAction";
import { Trash2, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

type Student = {
  name?: string;
  lastname?: string;
};

function SeveralStudentsModal({
  open,
  onClose,
  school,
  grade,
}: {
  open: boolean;
  onClose: () => void;
  school?: string;
  grade?: string;
}) {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [page, setPage] = useState("0");
  const [students, setStudents] = useState<Student[] | []>([]);
  const [process, setProcess] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileSelected(file);
      setProcess(1);
    }
  };

  const handleFileUpload = async (page: number) => {
    if (!fileSelected) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[page];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      for (let i = 4; i < jsonData.length; i++) {
        const studentData = jsonData[i][0];
        if (!studentData) continue;

        const [lastname, ...nameParts] = studentData.split(", ");
        const name = nameParts.join(" ").trim().toLowerCase();
        const lastnameLower = lastname.trim().toLowerCase();

        if (!name) continue;

        const newStudent = {
          name: name,
          lastname: lastnameLower,
        };
        setStudents((prev) => [...prev, newStudent]);
      }
    };
    reader.readAsBinaryString(fileSelected);
    setProcess(2);
  };

  const onSubmit = async () => {
    setLoading(true);
    if (!students.length) {
      toast.error("No hay alumnos para crear");
      setLoading(false);
      return;
    }
    const parseStudents = students.map((student) => ({
      name: student.name,
      lastname: student.lastname,
      displayName: `${student.name} ${student.lastname}`,
      schoolId: school,
      gradeId: grade,
    }));

    const response = await createManyStudents(parseStudents);
    if (response.success) {
      toast.success(response.message);
      setLoading(false);
      onClose();
    } else {
      toast.error("Error al crear los alumnos");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setFileSelected(null);
      setStudents([]);
      setPage("0");
      setProcess(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear alumnos</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col w-full justify-center items-center">
            {process === 0 && (
              <Label
                className="flex flex-col items-center justify-end w-60 text-center cursor-pointer"
                htmlFor="image-upload"
              >
                <div className="rounded-full items-center flex justify-center border w-12 h-12 hover:opacity-60">
                  <Upload size={18} />
                </div>
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Haga clic para seleccionar un archivo
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Label>
            )}
            {process === 1 && !!fileSelected && (
              <div className="mt-4 text-center flex flex-col gap-5">
                <p className="text-sm font-medium text-gray-600">
                  Archivo seleccionado: {fileSelected.name}
                </p>
                <div className="text-left space-y-2">
                  <Label>Numero de pagina</Label>
                  <Input
                    placeholder="Seleccione el numero de pagina"
                    value={page}
                    onChange={({ target }) => setPage(target.value)}
                    type="number"
                  />
                </div>
                <Button onClick={() => handleFileUpload(parseInt(page))}>
                  Cargar
                </Button>
              </div>
            )}
            {process === 2 && (
              <div className="w-full">
                <ScrollArea className="h-[500px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numero</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length ? (
                        students.map((student, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.lastname}</TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                className="rounded-full"
                                variant="outline"
                                onClick={() => {
                                  setStudents((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            className="h-60"
                          >
                            No hay alumnos
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        {process === 2 && (
          <div className="flex w-full justify-evenly mt-10 gap-5">
            <LoadingButton
              title="Crear"
              classname="w-40"
              onClick={onSubmit}
              loading={loading}
            />
            <Button
              className="w-40"
              variant="outline"
              onClick={() => {
                setFileSelected(null);
                setStudents([]);
                setPage("0");
                setProcess(0);
              }}
            >
              Reset
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SeveralStudentsModal;
