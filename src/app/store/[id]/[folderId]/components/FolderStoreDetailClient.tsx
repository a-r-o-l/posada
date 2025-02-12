"use client";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useEffect, useState } from "react";
import { IFolder } from "@/models/Folder";
import { nameParser } from "@/lib/utilsFunctions";
import { Separator } from "@/components/ui/separator";
import { Folder } from "lucide-react";
import PublicFile from "./PublicFile";
import SelectFileModal from "./SelectFileModal";
import { IFile } from "@/models/File";
import { IProduct } from "@/models/Product";

type folderWithFiles = IFolder & { files: IFile[] };

function FolderStoreDetailClient({
  folder,
  products,
}: {
  folder: folderWithFiles;
  products: IProduct[];
}) {
  const accesses = useCacheSchools((state) => state.accesses);
  // const addAccess = useCacheSchools((state) => state.addAccess);

  // const [needAccess, setNeedAccess] = useState(false);
  const [fileModal, setFileModal] = useState<IFile | null>(null);

  useEffect(() => {
    if (!accesses.includes(folder._id) && folder.isPrivate) {
      // setNeedAccess(true);
    }
  }, [accesses, folder]);

  const onClickFile = (file: IFile) => {
    setFileModal(file);
  };

  return (
    <div className="">
      <div className="flex items-center gap-5 p-10">
        <Folder className="w-28 h-28" />
        <div>
          <div className="font-semibold text-2xl">
            {nameParser(folder.title)}
          </div>
          <div className="text-gray-500 text-xl">{folder.description}</div>
        </div>
      </div>
      <Separator className="" />
      <div className="flex flex-wrap gap-5 p-10">
        {folder?.files?.map((file) => (
          <PublicFile file={file} key={file._id} onClick={onClickFile} />
        ))}
      </div>
      <SelectFileModal
        open={!!fileModal}
        onClose={() => setFileModal(null)}
        file={fileModal}
        products={products}
      />
    </div>
  );
}

export default FolderStoreDetailClient;
