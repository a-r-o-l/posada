"use client";
import { ISchool } from "@/models/School";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useEffect, useState } from "react";
import SchoolPasswordModal from "./SchoolPasswordModal";
import { IFolder } from "@/models/Folder";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import DynamicFolder from "./DynamicFolder";
import Link from "next/link";
import BuyTutorial from "./BuyTutorial";
import DateSelect from "./DateSelect";
import { toast } from "sonner";
import { getAllStudentByGrade } from "@/server/studentAction";
import { IStudent } from "@/models/Student";

function SchoolStoreDetailClient({
  school,
  folders,
  level,
}: {
  school: ISchool;
  folders: IFolder[];
  level: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accesses = useCacheSchools((state) => state.accesses);
  const addAccess = useCacheSchools((state) => state.addAccess);
  const { user } = useUser();

  const [needAccess, setNeedAccess] = useState(false);

  useEffect(() => {
    if (!accesses.includes(school._id) && school.isPrivate) {
      setNeedAccess(true);
    }
  }, [accesses, school]);

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("level", value);
    router.push(`?${params.toString()}`);
  };

  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex flex-row items-center justify-evenly rounded-t-3xl bg-[#F0F1FF] lg:min-w-40 lg:h-full lg:flex-col lg:justify-start lg:rounded-l-3xl lg:rounded-r-none lg:gap-5 lg:w-40">
        <Link href={school?._id ? `/store/${school._id}` : "#"}>
          <Image
            src={school?.imageUrl || "/placeholderimg.jpg"}
            alt={school?.name || "School Image"}
            width={150}
            height={150}
          />
        </Link>

        <DynamicFolder
          color="blue"
          title="Jardin"
          isOpened={level === "jardin"}
          height={130}
          width={130}
          onClick={() => handleClick("jardin")}
        />
        <DynamicFolder
          color="green"
          title="Primaria"
          isOpened={level === "primaria"}
          height={130}
          width={130}
          onClick={() => handleClick("primaria")}
        />
        <DynamicFolder
          color="yellow"
          title="Secundaria"
          isOpened={level === "secundaria"}
          height={130}
          width={130}
          onClick={() => handleClick("secundaria")}
        />
        <DynamicFolder
          color="red"
          title="Eventos"
          isOpened={level === "eventos"}
          height={130}
          width={130}
          onClick={() => handleClick("eventos")}
        />
      </div>
      <div className="flex flex-col h-full w-full bg-[#F0F1FF] border-t-8 rounded-b-3xl lg:border-l-8 lg:border-t-0 border-[#139FDC] p-5 lg:rounded-r-3xl lg:rounded-l-none">
        <BuyTutorial />
        <DateSelect url={`/store/${school._id}`} />
        <div className="flex flex-wrap gap-5 p-5 h-full w-full rounded-3xl items-start border-2 border-[#139FDC]">
          {!!level ? (
            folders.length ? (
              folders.map((folder) => (
                <DynamicFolder
                  key={folder._id}
                  color="blue"
                  title={folder.title}
                  isOpened={false}
                  height={130}
                  width={130}
                  onClick={async () => {
                    if (user?.role !== "user") {
                      router.push(`/store/${school._id}/${folder._id}`);
                      return;
                    }
                    const folderGrades = folder.grades || [];
                    const children = user?.children || [];
                    if (folderGrades.length === 0) {
                      router.push(`/store/${school._id}/${folder._id}`);
                      return;
                    }
                    const { students } = await getAllStudentByGrade(
                      folderGrades[0]
                    );
                    const hasAccess = children.some((child) =>
                      students.some((student: IStudent) => {
                        const normalizedChildName = normalizeString(child.name);
                        const normalizedChildLastname = normalizeString(
                          child.lastname
                        );
                        const normalizedStudentName = normalizeString(
                          student.name
                        );
                        const normalizedStudentLastname = normalizeString(
                          student.lastname
                        );

                        return (
                          normalizedChildName === normalizedStudentName &&
                          normalizedChildLastname === normalizedStudentLastname
                        );
                      })
                    );

                    if (!hasAccess) {
                      toast.error("No tienes acceso a esta carpeta");
                      return;
                    }
                    router.push(`/store/${school._id}/${folder._id}`);
                  }}
                />
              ))
            ) : (
              <div className="flex flex-1 justify-center items-center h-full">
                <p className="text-muted-foreground">No hay carpetas</p>
              </div>
            )
          ) : (
            <div className="flex flex-1 justify-center items-center h-full">
              <p className="text-muted-foreground">
                Selecciona una carpeta de nivel
              </p>
            </div>
          )}
        </div>
      </div>
      <SchoolPasswordModal
        open={needAccess}
        onClose={() => setNeedAccess(false)}
        school={school}
        onAccess={() => addAccess(school._id)}
      />
    </div>
  );
}

export default SchoolStoreDetailClient;
