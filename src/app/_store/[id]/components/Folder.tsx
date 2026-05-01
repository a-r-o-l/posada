import React from "react";
import { Folder as FolderIcon } from "lucide-react";
import { IFolder } from "@/models/Folder";
import { IUser } from "@/context/UserContext";

function Folder({
  folder,
  onClick,
  account,
}: {
  folder: IFolder;
  onClick: (folder: IFolder) => void;
  account?: IUser;
}) {
  const hasAccessToFolder = (folderGrades: string[], userGrades: string[]) => {
    if (account?.role !== "user") {
      return true;
    }
    if (!folderGrades.length || !userGrades.length) return false;
    return folderGrades.some((grade) => userGrades.includes(grade));
  };

  if (folder.isPrivate) {
    if (
      hasAccessToFolder(folder?.grades || [], account?.availableGrades || [])
    ) {
      return (
        <div
          className={`flex flex-col justify-end text-blue-500 opacity-60 hover:opacity-100 cursor-pointer px-5`}
          onClick={() => onClick(folder)}
        >
          <FolderIcon size={160} />
          <div className="w-full text-center">
            <p className="font-black text-2xl">{folder.title}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`flex flex-col justify-end text-blue-500 cursor-not-allowed px-5 opacity-10`}
        >
          <FolderIcon size={160} />
          <div className="w-full text-center">
            <p className="font-black text-2xl">{folder.title}</p>
          </div>
        </div>
      );
    }
  }
  return (
    <div
      className={`flex flex-col justify-end text-blue-500 opacity-60 hover:opacity-100 cursor-pointer px-5`}
      onClick={() => onClick(folder)}
    >
      <FolderIcon size={160} />
      <div className="w-full text-center">
        <p className="font-black text-2xl">{folder.title}</p>
      </div>
    </div>
  );
}

export default Folder;
