"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { PartialSchool } from "@/models/School";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { FileSpreadsheet, Pencil, Trash2 } from "lucide-react";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import StudentModal from "./StudentModal";
import GradeModal from "./GradeModal";
import { IGrade } from "@/models/Grade";
import { IStudentWP } from "@/models/Student";
import { deleteStudent } from "@/server/studentAction";
import { toast } from "sonner";
import { initialsParser, nameParser } from "@/lib/utilsFunctions";
import { Badge } from "@/components/ui/badge";
import CustomDropDownMenu from "@/components/CustomDropDownMenu";
import CreateSchoolModal from "./CreateSchoolModal";
import SeveralStudentsModal from "./SeveralStudentsModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DateSelectAdminSchools from "./DateSelectAdminSchools";
import { deleteGrade } from "@/server/gradeAction";

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
  const [openSchoolModal, setOpenSchoolModal] = useState(false);
  const [openSeveralStudentsModal, setOpenSeveralStudentsModal] =
    useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openDeleteGradeAlert, setOpenDeleteGradeAlert] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudentWP | null>(
    null
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center">
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <CardTitle>Alumnos</CardTitle>
          </div>
          <CardDescription>Ver y administrar alumnos</CardDescription>
        </div>
        <div className="">
          <DateSelectAdminSchools url={`/admin/schools`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Colegios</CardTitle>
                <Button variant="link" onClick={() => setOpenSchoolModal(true)}>
                  Registrar colegio
                </Button>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent>
              <ScrollArea className="h-[500px] py-10">
                {schools.length ? (
                  schools?.map((school) => (
                    <Button
                      key={school._id}
                      variant={
                        selectedSchool === school._id ? "secondary" : "outline"
                      }
                      className="w-full justify-between mb-2 py-10 flex"
                      onClick={() => {
                        const currentUrl = new URL(window.location.href);
                        const params = new URLSearchParams(currentUrl.search);
                        params.delete("grade");
                        params.set("school", school?._id || "");
                        router.push(
                          `${currentUrl.pathname}?${params.toString()}`
                        );
                      }}
                    >
                      <div className="flex justify-center w-full items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-16 w-24">
                                <AvatarImage
                                  src={school.imageUrl}
                                  alt={school.name}
                                />
                                <AvatarFallback>
                                  {initialsParser(school?.name || "")}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent className="border border-black bg-background">
                              <div className="min-w-14 overflow-hidden">
                                <div className="font-semibold text-black">
                                  {school.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {school.name}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CustomDropDownMenu
                        onEditClick={() => {}}
                        onDeleteClick={() => {}}
                        title={school?.name || ""}
                      />
                    </Button>
                  ))
                ) : (
                  <div className="w-full h-60 flex items-center justify-center">
                    <span className="mt-2 block text-sm font-medium text-muted-foreground">
                      No hay colegios
                    </span>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Cursos</CardTitle>
                <Button
                  variant="link"
                  disabled={!selectedSchool}
                  onClick={() => setGradeModal(true)}
                >
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
                      className="w-full justify-start text-left mb-2 py-10"
                      onClick={() => {
                        const currentUrl = new URL(window.location.href);
                        const params = new URLSearchParams(currentUrl.search);
                        params.set("grade", grade?._id || "");
                        router.push(
                          `${currentUrl.pathname}?${params.toString()}`
                        );
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-5">
                          <p className="font-semibold">{grade.grade}</p>
                          <Badge variant="outline">
                            <p className="text-sm text-gray-500 font-semibold">
                              {nameParser(grade.division)}
                            </p>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{grade.year}</p>
                        <div className="flex gap-5">
                          <CustomDropDownMenu
                            onEditClick={() => {}}
                            onDeleteClick={() => {
                              setOpenDeleteGradeAlert(true);
                            }}
                            title={`${grade.grade} - ${nameParser(
                              grade.division
                            )}`}
                          />
                        </div>
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
        school={selectedSchool}
        grade={selectedGrade}
      />
      <GradeModal
        open={gradeModal}
        onClose={() => setGradeModal(false)}
        school={selectedSchool}
      />
      <CreateSchoolModal
        open={openSchoolModal}
        onClose={() => setOpenSchoolModal(false)}
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
