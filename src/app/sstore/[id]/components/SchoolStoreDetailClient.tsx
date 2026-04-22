"use client";
import { ISchool } from "@/models/School";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useCallback, useEffect, useState } from "react";
import SchoolPasswordModal from "./SchoolPasswordModal";
import { IFolder } from "@/models/Folder";
import { useRouter, useSearchParams } from "next/navigation";
import DynamicFolder from "./DynamicFolder";
import { toast } from "sonner";
import { IStudent } from "@/models/Student";
import { useUser } from "@/hooks/use-user";
import { useProfileStudents } from "@/supabase/hooks/client/useProfileStudents";
import { useStudents } from "@/supabase/hooks/client/useStudents";
import { useFolders } from "@/supabase/hooks/client/useFolders";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Layers, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { School } from "@/supabase/models/school";

function SchoolStoreDetailClient({ school }: { school: School }) {
  const router = useRouter();
  const { fetchProfileStudentsByAccountId, profileStudents } =
    useProfileStudents();
  const { fetchStudentsByGradeId } = useStudents();
  const { folders, fetchFoldersBySchoolYearLevel, loading } = useFolders();
  const searchParams = useSearchParams();
  const accesses = useCacheSchools((state) => state.accesses);
  const addAccess = useCacheSchools((state) => state.addAccess);
  const { user } = useUser();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [division, setDivision] = useState("jardin");
  const [needAccess, setNeedAccess] = useState(false);

  useEffect(() => {
    if (!accesses.includes(school.id) && school.isPrivate) {
      setNeedAccess(true);
    }
  }, [accesses, school]);

  useEffect(() => {
    console.log("fetch folders");
    if (division && year && school) {
      fetchFoldersBySchoolYearLevel(school.id, year, division);
    }
  }, [school, division, year]);

  useEffect(() => {
    if (user) {
      fetchProfileStudentsByAccountId(user?.id || "");
    }
  }, [user]);

  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const handleFolderClick = useCallback(
    async (folder: IFolder) => {
      if (user?.role !== "user") {
        router.push(`/sstore/${school.id}/${folder.id}`);
        return;
      }
      const folderGrades = folder.grades || [];
      const children = profileStudents.map((ps) => ps.student) || [];
      if (folderGrades.length === 0) {
        router.push(`/sstore/${school.id}/${folder.id}`);
        return;
      }
      const { data: students } = await fetchStudentsByGradeId(folderGrades[0]);
      if (students.length === 0) {
        toast.error("No hay estudiantes asociados a esta carpeta");
        return;
      }
      const hasAccess = children.some((child) =>
        students.some((student: IStudent) => {
          const normalizedChildName = normalizeString(child.name);
          const normalizedChildLastname = normalizeString(child.lastname);
          const normalizedStudentName = normalizeString(student.name);
          const normalizedStudentLastname = normalizeString(student.lastname);
          const nameMatches =
            normalizedStudentName.includes(normalizedChildName) ||
            normalizedChildName.includes(normalizedStudentName);
          const lastnameMatches =
            normalizedStudentLastname.includes(normalizedChildLastname) ||
            normalizedChildLastname.includes(normalizedStudentLastname);
          return nameMatches && lastnameMatches;
        }),
      );

      if (!hasAccess) {
        toast.error("No tienes acceso a esta carpeta");
        return;
      }
      router.push(`/sstore/${school.id}/${folder.id}`);
    },
    [user, school.id, router, fetchStudentsByGradeId, profileStudents],
  );

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* <div className="flex flex-row items-center justify-evenly rounded-t-3xl bg-[#F0F1FF] lg:min-w-40 lg:h-full lg:flex-col lg:justify-start lg:rounded-l-3xl lg:rounded-r-none lg:gap-5 lg:w-40">
        <Link href={school?.id ? `/sstore/${school.id}` : "#"}>
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
      </div> */}
      <div className="flex flex-col h-full w-full bg-[#F0F1FF] border-t-8 rounded-b-3xl lg:border-l-8 lg:border-t-0 border-[#139FDC] p-5 lg:rounded-r-3xl lg:rounded-l-3xl">
        <div className="w-full flex justify-center items-end mb-5 lg:justify-start">
          <Link href={school?.id ? `/sstore/${school.id}` : "#"}>
            <Image
              src={school?.image_url || "/placeholderimg.jpg"}
              alt={school?.name || "School Image"}
              width={150}
              height={150}
            />
          </Link>
          <div className="w-96 px-5 text-center">
            <Label>Año</Label>
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
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-96 px-5 text-center">
            <Label>División</Label>
            <div className="flex items-center gap-2">
              <Layers size={24} />
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger className="border-[#139FDC] border-2">
                  <SelectValue className="capitalize">
                    <span className="capitalize">{division}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="jardin">Jardín</SelectItem>
                    <SelectItem value="primaria">Primaria</SelectItem>
                    <SelectItem value="secundaria">Secundaria</SelectItem>
                    <SelectItem value="eventos">Eventos</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 p-5 h-full w-full rounded-3xl items-start border-2 border-[#139FDC] overflow-auto  ">
          {loading ? (
            <div className="flex flex-1 justify-center items-center h-full">
              <Loader2 className="animate-spin" size={48} />
            </div>
          ) : folders.length ? (
            folders.map((folder) => (
              <DynamicFolder
                key={folder.id}
                color="blue"
                title={folder.title}
                isOpened={false}
                height={130}
                width={130}
                onClick={() => handleFolderClick(folder)}
              />
            ))
          ) : (
            <div className="flex flex-1 justify-center items-center h-full">
              <p className="text-muted-foreground">No hay carpetas</p>
            </div>
          )}
        </div>
      </div>
      <SchoolPasswordModal
        open={needAccess}
        onClose={() => setNeedAccess(false)}
        school={school}
        onAccess={() => addAccess(school.id)}
      />
    </div>
  );
}

export default SchoolStoreDetailClient;
