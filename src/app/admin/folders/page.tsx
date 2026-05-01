import React from "react";
import FoldersClientSide from "./components/FoldersClientSide";
import { getSchools } from "@/supabase/hooks/server/schools";
import { getGradesBySchoolId } from "@/supabase/hooks/server/grades";
import { getFoldersBySchoolId } from "@/supabase/hooks/server/folders";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; level?: string; year?: string }>;
}) {
  const search = await searchParams;
  const schools = await getSchools();
  const folders = await getFoldersBySchoolId(
    search?.school || "",
    search.level,
    search.year,
  );
  const grades = await getGradesBySchoolId(search?.school || "");

  return (
    <div className="p-4 w-full">
      <FoldersClientSide
        schools={schools}
        folders={folders}
        selectedSchool={search.school || undefined}
        grades={grades}
      />
    </div>
  );
}
