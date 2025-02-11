import React from "react";
import { getSchool } from "@/server/schoolAction";
import SchoolDetailClientSide from "./components/SchoolDetailClientSide";
import { getAllFolders, getOneFolder } from "@/server/folderAction";
import { getAllFiles } from "@/server/fileAction";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folder: string }>;
}) {
  const param = await params;
  const search = await searchParams;
  const { school: selectedSchool } = await getSchool(param.id);
  const { folders } = await getAllFolders(param.id);
  const { files } = await getAllFiles(search.folder);
  const { folder } = await getOneFolder(search.folder);
  return (
    <div className="p-4 w-full">
      <SchoolDetailClientSide
        selectedSchool={selectedSchool}
        selectedFolder={folder}
        folders={folders}
        files={files}
      />
    </div>
  );
}
