import React from "react";
import FolderDetailClientSide from "./components/FolderDetailClientSide";
import { getFoldersAndFiles, getOneFolder } from "@/server/folderAction";
import { getAllGradesBySchool } from "@/server/gradeAction";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const { data } = await getFoldersAndFiles(param.id);
  const { folder } = await getOneFolder(param.id);
  const { grades } = await getAllGradesBySchool(folder.schoolId);

  return (
    <div className="p-4 w-full">
      <FolderDetailClientSide
        selectedFolder={folder}
        folders={data.folders}
        files={data.files}
        grades={grades}
      />
    </div>
  );
}
