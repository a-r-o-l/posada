"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import { PartialSchool } from "@/models/School";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, FileSpreadsheet, Pencil, Trash2 } from "lucide-react";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import StudentModal from "./StudentModal";
import GradeModal from "./GradeModal";
import { IGrade } from "@/models/Grade";
import { IStudentWP } from "@/models/Student";
import { deleteStudent } from "@/server/studentAction";
import { toast } from "sonner";
import { initialsParser, nameParser } from "@/lib/utilsFunctions";
import CustomDropDownMenu from "@/components/CustomDropDownMenu";
import SeveralStudentsModal from "./SeveralStudentsModal";
import DateSelectAdminSchools from "./DateSelectAdminSchools";
import { deleteGrade } from "@/server/gradeAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function StudentsClientSide({
  schools,
  selectedSchool,
  grades,
  selectedGrade,
  students,
}: {
  schools: PartialSchool[];
  selectedSchool?: string;
  grades: IGrade[];
  selectedGrade: string;
  students: IStudentWP[];
}) {
  const router = useRouter();
  const [studentModal, setStudentModal] = useState(false);
  const [gradeModal, setGradeModal] = useState(false);
  const [openSeveralStudentsModal, setOpenSeveralStudentsModal] =
    useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openDeleteGradeAlert, setOpenDeleteGradeAlert] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudentWP | null>(
    null
  );
  const [editGrade, setEditGrade] = useState<IGrade | null>(null);
  const [editStudent, setEditStudent] = useState<IStudentWP | null>(null);

  const school = useMemo(() => {
    const foundSchool = schools.find(
      (eachSchool) => eachSchool._id === selectedSchool
    );
    if (!foundSchool) {
      return null;
    }
    return foundSchool;
  }, [schools, selectedSchool]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row">
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
        <div className="w-full flex flex-col gap-5">
          <Button
            size="icon"
            variant="outline"
            onClick={() => router.push("/admin/schools")}
            className="rounded-full"
          >
            <ArrowLeft />
          </Button>
          <div className="flex items-center justify-between w-full px-20">
            <div className="flex items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={school?.imageUrl}
                  alt={school?.name}
                  className="object-contain !aspect-square p-1"
                />
                <AvatarFallback>
                  {initialsParser(school?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-muted-foreground">Colegio </p>
                <h1 className="font-bold">{school?.name}</h1>
              </div>
            </div>
            <div className="">
              <DateSelectAdminSchools
                url={`/admin/schools/${selectedSchool}`}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Cursos</CardTitle>
                <Button variant="link" onClick={() => setGradeModal(true)}>
                  Registrar curso
                </Button>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent>
              <ScrollArea className="h-[500px] py-10">
                {grades.length ? (
                  grades?.map((grade) => (
                    <Button
                      key={grade._id}
                      variant={
                        selectedGrade === grade._id ? "secondary" : "outline"
                      }
                      className="w-full justify-start text-left mb-2 p-10 relative"
                      onClick={() => {
                        const currentUrl = new URL(window.location.href);
                        const params = new URLSearchParams(currentUrl.search);
                        params.set("grade", grade?._id || "");
                        router.push(
                          `${currentUrl.pathname}?${params.toString()}`
                        );
                      }}
                    >
                      <div className="flex flex-col items-start w-full">
                        <p className="font-semibold">{grade.grade}</p>
                        <p className="text-sm text-gray-500 font-semibold">
                          {nameParser(grade.division)}
                        </p>
                      </div>
                      <div className="absolute top-1 right-1">
                        <CustomDropDownMenu
                          onEditClick={() => {
                            setEditGrade(grade);
                            setGradeModal(true);
                          }}
                          onDeleteClick={() => {
                            setOpenDeleteGradeAlert(true);
                          }}
                          title={`${grade.grade} - ${nameParser(
                            grade.division
                          )}`}
                        />
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="w-full h-60 flex items-center justify-center">
                    <span className="mt-2 block text-sm font-medium text-muted-foreground">
                      No hay cursos
                    </span>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Alumnos</CardTitle>
                <div className="flex items-center gap-5">
                  <Button
                    disabled={!selectedGrade}
                    variant="link"
                    onClick={() => setStudentModal(true)}
                  >
                    Registrar alumno
                  </Button>
                  <Button
                    disabled={!selectedGrade}
                    variant="outline"
                    size="icon"
                    className="rounded-full text-blue-500"
                    onClick={() => setOpenSeveralStudentsModal(true)}
                  >
                    <FileSpreadsheet />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent className="">
              <ScrollArea className="h-[500px]">
                <Table className="py-10">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellido</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!!students?.length ? (
                      students.map((student) => (
                        <TableRow
                          key={student._id}
                          onClick={() => setSelectedStudent(student)}
                          className={`hover:cursor-pointer ${
                            selectedStudent?._id === student._id
                              ? "bg-slate-100 text-black"
                              : ""
                          }`}
                        >
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.lastname}</TableCell>
                          <TableCell>{student.gradeId?.grade}</TableCell>
                          <TableCell>
                            {nameParser(student.gradeId?.division)}
                          </TableCell>
                          <TableCell className="text-end gap-2 flex justify-end">
                            <Button
                              className="rounded-full text-black"
                              size="icon"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditStudent(student);
                                setStudentModal(true);
                              }}
                            >
                              <Pencil size={20} />
                            </Button>
                            <Button
                              className="rounded-full text-black"
                              size="icon"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(student);
                                setOpenDeleteAlert(true);
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
                          colSpan={6}
                          className="text-sm font-medium text-muted-foreground text-center h-60"
                        >
                          No hay alumnos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CustomAlertDialog
        title="Eliminar alumno"
        description="¿Estás seguro que deseas eliminar este alumno?"
        open={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        onAccept={async () => {
          if (!selectedStudent) return;
          const res = await deleteStudent(selectedStudent?._id || "");
          if (res.success) {
            toast.success(res.message);
            setOpenDeleteAlert(false);
            setSelectedStudent(null);
          } else {
            toast.error(res.message);
          }
        }}
      />
      <CustomAlertDialog
        title="Eliminar curso"
        description="¿Estás seguro que deseas eliminar este curso?"
        open={openDeleteGradeAlert}
        onClose={() => setOpenDeleteGradeAlert(false)}
        onAccept={async () => {
          if (!selectedGrade) return;
          const res = await deleteGrade(selectedGrade || "");
          if (res.success) {
            toast.success(res.message);
            setOpenDeleteGradeAlert(false);
          } else {
            toast.error(res.message);
          }
        }}
      />
      <StudentModal
        open={studentModal}
        onClose={() => setStudentModal(false)}
        school={school}
        grade={selectedGrade}
        editStudent={editStudent}
      />
      <GradeModal
        open={gradeModal}
        onClose={() => {
          setGradeModal(false);
          setEditGrade(null);
        }}
        school={school || null}
        editGrade={editGrade}
      />
      <SeveralStudentsModal
        open={openSeveralStudentsModal}
        onClose={() => setOpenSeveralStudentsModal(false)}
        grade={selectedGrade}
        school={selectedSchool}
      />
    </Card>
  );
}

export default StudentsClientSide;
