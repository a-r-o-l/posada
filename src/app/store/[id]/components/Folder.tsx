import React from "react";
import { Folder as FolderIcon } from "lucide-react";
import { IFolder } from "@/models/Folder";

function Folder({
  folder,
  onClick,
}: {
  folder: IFolder;
  onClick: (folder: IFolder) => void;
}) {
  return (
    <div
      className="flex flex-col justify-end text-blue-500 opacity-60 hover:opacity-100 cursor-pointer px-5"
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
