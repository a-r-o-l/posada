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
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex flex-row items-center justify-evenly rounded-t-3xl bg-[#F0F1FF] lg:hidden">
        <Link href={`/store/${school._id}`}>
          <Image
            src={school.imageUrl || "/placeholderimg.jpg"}
            alt={school.name}
            width={100}
            height={100}
          />
        </Link>
        <DynamicFolder
          color={getFolderColor(folder.level)}
          title={nameParser(folder.level)}
          isOpened={true}
          height={80}
          width={80}
          onClick={() =>
            router.push(`/store/${school._id}?level=${folder.level}`)
          }
        />
        <DynamicFolder
          color="blue"
          title={nameParser(folder.title)}
          isOpened={true}
          height={80}
          width={80}
          onClick={() => {}}
        />
      </div>
      <div className="hidden bg-[#F0F1FF] items-center lg:flex lg:min-w-40 lg:h-full lg:flex-col lg:justify-start lg:rounded-l-3xl lg:rounded-r-none lg:gap-5 lg:w-40">
        <Link href={`/store/${school._id}`}>
          <Image
            src={school.imageUrl || "/placeholderimg.jpg"}
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

      <div
        className="flex flex-wrap gap-5 p-10 bg-[#F0F1FF] w-full
      border-t-8
      lg:border-t-0
      lg:rounded-r-3xl items-start lg:border-l-8 border-[#139FDC] h-full overflow-y-auto justify-center lg:justify-normal"
      >
        {!!folder.files.length ? (
          folder?.files?.map((file) => (
            <PublicFile file={file} key={file._id} onClick={onClickFile} />
          ))
        ) : (
          <div className="flex flex-1 justify-center items-center h-full">
            <p className="text-muted-foreground">
              No hay fotos en esta carpeta
            </p>
          </div>
        )}
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
