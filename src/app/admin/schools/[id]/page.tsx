import React from "react";
import StudentsClientSide from "../components/StudentsClientSide";
import { getAllSchools } from "@/server/schoolAction";
import { getAllGradesBySchoolAndYear } from "@/server/gradeAction";
import { getAllStudentByGrade } from "@/server/studentAction";

export default async function page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ school: string; grade: string; year: string }>;
  params: Promise<{ id: string }>;
}) {
  const search = await searchParams;
  const param = await params;

  const { schools } = await getAllSchools();
  const { grades } = await getAllGradesBySchoolAndYear(param.id, search.year);
  const { students } = await getAllStudentByGrade(search.grade);

  return (
    <div className="p-4 w-full">
      <StudentsClientSide
        schools={schools}
        grades={grades}
        students={students}
        selectedGrade={search.grade}
        selectedSchool={param.id}
      />
    </div>
  );
}
