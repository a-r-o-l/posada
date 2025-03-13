import React from "react";
import FoldersClientSide from "./components/FoldersClientSide";
import { getAllSchools } from "@/server/schoolAction";
import { getFoldersByLvlAndYear } from "@/server/folderAction";
import { getAllGradesBySchool } from "@/server/gradeAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; level?: string; year?: string }>;
}) {
  const search = await searchParams;
  const { schools } = await getAllSchools();
  const { folders } = await getFoldersByLvlAndYear(
    search.school,
    search.level,
    search.year
  );
  const { grades } = await getAllGradesBySchool(search.school);

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
