"use client";
import { ISchool } from "@/models/School";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useEffect, useState } from "react";
import SchoolPasswordModal from "./SchoolPasswordModal";
import { IFolder } from "@/models/Folder";
import Folder from "./Folder";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import DynamicFolder from "./DynamicFolder";
import Link from "next/link";
import BuyTutorial from "./BuyTutorial";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

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
  const [year, setYear] = useState("");

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

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex flex-row items-center justify-evenly rounded-t-3xl bg-[#F0F1FF] lg:min-w-40 lg:h-full lg:flex-col lg:justify-start lg:rounded-l-3xl lg:rounded-r-none lg:gap-5 lg:w-40">
        <Link href={`/store/${school._id}`}>
          <Image
            src={school.imageUrl || ""}
            alt={school.name}
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
      <div className="flex flex-col h-full w-full bg-[#F0F1FF] border-t-8 rounded-b-3xl lg:border-l-8 lg:border-t-0 border-[#139FDC] p-5 lg:rounded-r-3xl">
        <div className="w-full flex justify-end items-end absolute right-5">
          <div className="w-1/4 px-5 text-center">
            <Label>Seleccione el año</Label>
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="border-[#139FDC] border-2">
                  <SelectValue>{year}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <BuyTutorial />
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
                  onClick={() =>
                    router.push(`/store/${school._id}/${folder._id}`)
                  }
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
