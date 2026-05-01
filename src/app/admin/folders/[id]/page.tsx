import React from "react";
import FolderDetailClientSide from "./components/FolderDetailClientSide";
import { getFolder } from "@/supabase/hooks/server/folders";
import { getGradesBySchoolId } from "@/supabase/hooks/server/grades";
import { getFilesAndFoldersByFolderId } from "@/supabase/hooks/server/files";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const { files, folders } = await getFilesAndFoldersByFolderId(param.id);
  const folder = await getFolder(param.id);
  const grades = await getGradesBySchoolId(folder.school_id);

  return (
    <div className="p-4 w-full">
      <FolderDetailClientSide
        selectedFolder={folder}
        folders={folders}
        files={files}
        grades={grades}
      />
    </div>
  );
}
