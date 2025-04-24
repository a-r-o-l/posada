import React from "react";
import StudentsClientSide from "./components/StudentsClientSide";
import { getAllSchools } from "@/server/schoolAction";
import { getAllGradesBySchoolAndYear } from "@/server/gradeAction";
import { getAllStudentByGrade } from "@/server/studentAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ school: string; grade: string; year: string }>;
}) {
  const search = await searchParams;

  const { schools } = await getAllSchools();
  const { grades } = await getAllGradesBySchoolAndYear(
    search.school,
    search.year
  );
  const { students } = await getAllStudentByGrade(search.grade);

  return (
    <div className="p-4 w-full">
      <StudentsClientSide
        schools={schools}
        grades={grades}
        students={students}
        selectedGrade={search.grade}
        selectedSchool={search.school}
      />
    </div>
  );
}
