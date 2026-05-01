"use client";
import React, { useEffect, useMemo, useState } from "react";
import { nameParser } from "@/lib/utilsFunctions";
import Image from "next/image";
import DynamicFolder from "../../components/DynamicFolder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFolders } from "@/supabase/hooks/client/useFolders";
import PublicFile from "./PublicFile";
import SelectFileModal from "./SelectFileModal";
import { useProducts } from "@/supabase/hooks/client/useProducts";
import { File } from "@/supabase/models/file";

function FolderStoreDetailClient({ folderId }: { folderId: string }) {
  const router = useRouter();
  const { fetchFolderById, folder } = useFolders();
  const { fetchProductsBySchoolId, products } = useProducts();
  // const [needAccess, setNeedAccess] = useState(false);
  const [fileModal, setFileModal] = useState<File | null>(null);

  const school = useMemo(() => {
    if (!folder) return null;
    return folder.school;
  }, [folder]);

  const files = useMemo(() => {
    if (!folder) return [];
    return folder.files || [];
  }, [folder]);

  useEffect(() => {
    if (folderId) fetchFolderById(folderId);
  }, [folderId]);

  useEffect(() => {
    if (school) fetchProductsBySchoolId(school.id);
  }, [school]);

  const onClickFile = (file: File) => {
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
        <Link href={`/store/${school?.id}`}>
          <Image
            src={school?.image_url || "/placeholderimg.jpg"}
            alt={school?.name || "Escuela"}
            width={100}
            height={100}
          />
        </Link>
        <DynamicFolder
          color={getFolderColor(folder?.level || "")}
          title={nameParser(folder?.level || "")}
          isOpened={true}
          height={80}
          width={80}
          onClick={() =>
            router.push(
              `/store/${school?.id}?level=${folder?.level}&year=${folder?.year}`,
            )
          }
        />
        <DynamicFolder
          color="blue"
          title={nameParser(folder?.title || "")}
          isOpened={true}
          height={80}
          width={80}
        />
      </div>
      <div className="hidden bg-[#F0F1FF] items-center lg:flex lg:min-w-40 lg:h-full lg:flex-col lg:justify-start lg:rounded-l-3xl lg:rounded-r-none lg:gap-5 lg:w-40">
        <Link href={`/store/${school?.id}`}>
          <Image
            src={school?.image_url || "/placeholderimg.jpg"}
            alt={school?.name || "Escuela"}
            width={150}
            height={150}
          />
        </Link>
        <DynamicFolder
          color={getFolderColor(folder?.level || "")}
          title={nameParser(folder?.level || "")}
          isOpened={true}
          height={130}
          width={130}
          onClick={() =>
            router.push(
              `/store/${school?.id}?level=${folder?.level}&year=${folder?.year}`,
            )
          }
        />
        <DynamicFolder
          color="blue"
          title={nameParser(folder?.title || "")}
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
        {!!files.length ? (
          files?.map((file) => (
            <PublicFile file={file} key={file.id} onClick={onClickFile} />
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
