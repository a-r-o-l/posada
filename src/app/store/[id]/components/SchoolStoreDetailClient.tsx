"use client";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useCallback, useEffect, useState } from "react";
import SchoolPasswordModal from "./SchoolPasswordModal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DynamicFolder from "./DynamicFolder";
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
import { Folder } from "@/supabase/models/folder";

function SchoolStoreDetailClient({ school }: { school: School }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const { fetchProfileStudentsByAccountId, profileStudents } =
  //   useProfileStudents();
  // const { fetchStudentsByGradeId } = useStudents();
  const { folders, fetchFoldersBySchoolYearLevel, loading } = useFolders();
  const accesses = useCacheSchools((state) => state.accesses);
  const addAccess = useCacheSchools((state) => state.addAccess);

  // Leer valores de URL o defaults
  const yearFromUrl = searchParams.get("year");
  const divisionFromUrl = searchParams.get("level");

  const [year, setYear] = useState(yearFromUrl || "2026");
  const [division, setDivision] = useState(divisionFromUrl || "eventos");
  const [needAccess, setNeedAccess] = useState(false);

  useEffect(() => {
    if (!accesses.includes(school.id) && school.is_private) {
      setNeedAccess(true);
    }
  }, [accesses, school]);

  // Fetch cuando cambian los filtros - SIN funciones en dependencias
  useEffect(() => {
    if (division && year && school) {
      fetchFoldersBySchoolYearLevel(school.id, year, division);
    }
  }, [school, division, year]);

  // useEffect(() => {
  //   if (user) {
  //     fetchProfileStudentsByAccountId(user.id);
  //   }
  // }, [user]);

  // Actualizar URL cuando cambian los filtros
  const updateUrl = useCallback(
    (newYear: string, newDivision: string) => {
      const params = new URLSearchParams();
      params.set("year", newYear);
      params.set("level", newDivision);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleYearChange = (value: string) => {
    setYear(value);
    updateUrl(value, division);
  };

  const handleDivisionChange = (value: string) => {
    setDivision(value);
    updateUrl(year, value);
  };

  // const normalizeString = (str: string): string => {
  //   return str
  //     .toLowerCase()
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "");
  // };

  const handleFolderClick = useCallback(
    async (folder: Folder) => {
      // const params = new URLSearchParams();
      // params.set("year", year);
      // params.set("level", division);

      // if (user?.role !== "user") {
      //   router.push(`/store/${school.id}/${folder.id}?${params.toString()}`);
      //   return;
      // }
      // const folderGrades = folder.grades || [];
      // const children = profileStudents.map((ps) => ps.student) || [];
      // if (folderGrades.length === 0) {
      //   router.push(`/store/${school.id}/${folder.id}?${params.toString()}`);
      //   return;
      // }
      // const { data: students } = await fetchStudentsByGradeId(folderGrades[0]);
      // if (students.length === 0) {
      //   toast.error("No hay estudiantes asociados a esta carpeta");
      //   return;
      // }
      // if (children.length === 0) {
      //   toast.error("No tienes hijos asociados a esta carpeta");
      //   return;
      // }
      // const hasAccess = children.some((child) =>
      //   students.some((student: IStudent) => {
      //     const normalizedChildName = normalizeString(child.name);
      //     const normalizedChildLastname = normalizeString(child.lastname);
      //     const normalizedStudentName = normalizeString(student.name);
      //     const normalizedStudentLastname = normalizeString(student.lastname);
      //     const nameMatches =
      //       normalizedStudentName.includes(normalizedChildName) ||
      //       normalizedChildName.includes(normalizedStudentName);
      //     const lastnameMatches =
      //       normalizedStudentLastname.includes(normalizedChildLastname) ||
      //       normalizedChildLastname.includes(normalizedStudentLastname);
      //     return nameMatches && lastnameMatches;
      //   }),
      // );

      // if (!hasAccess) {
      //   toast.error("No tienes acceso a esta carpeta");
      //   return;
      // }
      router.push(`/store/${school.id}/${folder.id}`);
    },
    [school.id, router],
  );

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex flex-col h-full w-full bg-[#F0F1FF] border-t-8 rounded-b-3xl lg:border-l-8 lg:border-t-0 border-[#139FDC] p-5 lg:rounded-r-3xl lg:rounded-l-3xl">
        <div className="w-full flex justify-center items-end mb-5 lg:justify-start">
          <Link href={school?.id ? `/store/${school.id}` : "#"}>
            <Image
              src={school?.image_url || "/placeholderimg.jpg"}
              alt={school?.name || "School Image"}
              width={150}
              height={150}
            />
          </Link>
          <div className="w-96 px-5 text-center">
            <Label className="text-xs md:text-base">Año</Label>
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger className="border-[#139FDC] border-2 w-full text-xs md:text-base">
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
            <Label className="text-xs md:text-base">División</Label>
            <div className="flex items-center gap-2">
              <Layers size={24} />
              <Select value={division} onValueChange={handleDivisionChange}>
                <SelectTrigger className="border-[#139FDC] border-2 w-full text-xs md:text-base">
                  <SelectValue>{division}</SelectValue>
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
        <div className="flex flex-wrap gap-5 p-5 h-full w-full rounded-3xl items-start border-2 border-[#139FDC] overflow-auto">
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
