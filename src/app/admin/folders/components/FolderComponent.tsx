import { IFolder } from "@/models/Folder";
import { Calendar, Lock, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import FolderDropDownMenu from "./FolderDropDownMenu";

function FolderComponent({
  folder,
  onDeleteFolder,
  onEditFolder,
}: {
  folder: IFolder;
  onDeleteFolder: (folder: IFolder) => void;
  onEditFolder: (folder: IFolder) => void;
}) {
  const router = useRouter();
  return (
    <div
      key={folder._id}
      className="w-48 h-32 rounded-xl flex flex-col gap-5 border"
    >
      <div className="p-1 relative h-full">
        {folder.isPrivate ? (
          <div className="absolute bottom-0 right-0 p-3">
            <Lock size={14} className="text-red-500" />
          </div>
        ) : (
          <div className="absolute bottom-0 right-0 p-3">
            <Unlock size={14} className="text-green-500" />
          </div>
        )}
        <div className="w-full flex justify-end">
          <FolderDropDownMenu
            onClick={() => {}}
            title={folder.title}
            onEditClick={() => onEditFolder(folder)}
            onDeleteClick={() => onDeleteFolder(folder)}
            onViewClick={() => router.push(`/admin/folders/${folder._id}`)}
          />
        </div>
        <div className="h-full flex flex-col">
          <p className="font-semibold text-center text-2xl">{folder.title}</p>
          <p className="text-sm text-muted-foreground text-center">
            {folder.description}
          </p>
        </div>
        <div className="flex items-center gap-2 justify-center absolute bottom-0 left-0 p-2 text-muted-foreground w-full">
          <Calendar size={10} />
          <p className="text-xs">
            {folder.year || new Date().getFullYear().toString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FolderComponent;
