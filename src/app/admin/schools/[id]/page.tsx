import React from "react";
import StudentsClientSide from "../components/StudentsClientSide";
import { getSchools } from "@/supabase/hooks/server/schools";
import { getStudentsByGrade } from "@/supabase/hooks/server/students";
import { getGradesBySchoolIdYear } from "@/supabase/hooks/server/grades";

export default async function page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ school: string; grade: string; year: string }>;
  params: Promise<{ id: string }>;
}) {
  const search = await searchParams;
  const param = await params;

  const schools = await getSchools();
  const { data: grades } = await getGradesBySchoolIdYear(param.id, search.year);
  const { data: students } = await getStudentsByGrade(search.grade);

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
