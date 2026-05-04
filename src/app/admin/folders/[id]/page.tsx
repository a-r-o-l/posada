import React from "react";
import FolderDetailClientSide from "./components/FolderDetailClientSide";
import { getFolder } from "@/supabase/hooks/server/folders";
import { getGradesBySchoolId } from "@/supabase/hooks/server/grades";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const folder = await getFolder(param.id);
  const grades = await getGradesBySchoolId(folder.school_id);

  return (
    <div className="p-4 w-full">
      <FolderDetailClientSide selectedFolder={folder} grades={grades} />
    </div>
  );
}
