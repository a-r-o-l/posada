"use client";
import { ISchool } from "@/models/School";
import { useCacheSchools } from "@/zustand/useCacheSchools";
import React, { useEffect, useState } from "react";
import SchoolPasswordModal from "./SchoolPasswordModal";
import { IFolder } from "@/models/Folder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameParser } from "@/lib/utilsFunctions";
import { Separator } from "@/components/ui/separator";
import Folder from "./Folder";
import { useRouter } from "next/navigation";

function SchoolStoreDetailClient({
  school,
  folders,
}: {
  school: ISchool;
  folders: IFolder[];
}) {
  const router = useRouter();
  const accesses = useCacheSchools((state) => state.accesses);
  const addAccess = useCacheSchools((state) => state.addAccess);

  const [needAccess, setNeedAccess] = useState(false);

  useEffect(() => {
    if (!accesses.includes(school._id) && school.isPrivate) {
      setNeedAccess(true);
    }
  }, [accesses, school]);

  return (
    <div className="">
      <div className="w-60 rounded-xl flex items-center gap-5 p-10">
        <Avatar className="w-28 h-28">
          <AvatarImage src={school.imageUrl} alt={school.name} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-2xl">
            {nameParser(school.name)}
          </div>
          <div className="text-gray-500 text-xl">{school.name}</div>
        </div>
      </div>
      <Separator className="" />
      <div className="flex flex-wrap gap-5 p-10">
        {folders.map((folder) => (
          <Folder
            key={folder._id}
            folder={folder}
            onClick={() => router.push(`/store/${school._id}/${folder._id}`)}
          />
        ))}
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
