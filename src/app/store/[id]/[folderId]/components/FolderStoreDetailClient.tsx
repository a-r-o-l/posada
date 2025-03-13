"use client";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useEffect, useState } from "react";
import { IFolder } from "@/models/Folder";
import { nameParser } from "@/lib/utilsFunctions";
import PublicFile from "./PublicFile";
import SelectFileModal from "./SelectFileModal";
import { IFile } from "@/models/File";
import { IProduct } from "@/models/Product";
import { ISchool } from "@/models/School";
import Image from "next/image";
import DynamicFolder from "../../components/DynamicFolder";
import { useRouter } from "next/navigation";
import Link from "next/link";

type folderWithFiles = IFolder & { files: IFile[] };

function FolderStoreDetailClient({
  folder,
  products,
  school,
}: {
  folder: folderWithFiles;
  products: IProduct[];
  school: ISchool;
}) {
  const router = useRouter();
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

  const getFolderColor = (level: string) => {
    switch (level) {
      case "jardin":
        return "blue";
      case "primaria":
        return "green";
      case "secundaria":
        return "yellow";
      default:
        return "red";
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center gap-10 p-10 bg-[#F0F1FF] h-full rounded-l-3xl">
        <Link href={`/store/${school._id}`}>
          <Image
            src={school.imageUrl || ""}
            alt={school.name}
            width={150}
            height={150}
          />
        </Link>
        <DynamicFolder
          color={getFolderColor(folder.level)}
          title={nameParser(folder.level)}
          isOpened={true}
          height={130}
          width={130}
          onClick={() =>
            router.push(`/store/${school._id}?level=${folder.level}`)
          }
        />
        <DynamicFolder
          color="blue"
          title={nameParser(folder.title)}
          isOpened={true}
          height={130}
          width={130}
          onClick={() => {}}
        />
      </div>

      <div className="flex flex-wrap gap-5 p-10 bg-[#F0F1FF] w-full rounded-r-3xl items-start border-l-8 border-[#139FDC]">
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
