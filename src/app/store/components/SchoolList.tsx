"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { IChildren } from "@/models/Account";
import { ISchool } from "@/models/School";
import { getAccount } from "@/server/accountAction";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function SchoolList({ schools }: { schools: ISchool[] }) {
  const router = useRouter();
  const { user } = useUser();
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      const searchAccount = async () => {
        const { account } = await getAccount(user.id, true);
        const schools = account.children.map((item: IChildren) => {
          return item.schoolId;
        });
        setAvailableSchools(schools);
      };
      searchAccount();
    }
  }, [user]);

  const haveAccess = (schoolId: string): boolean => {
    if (user?.role !== "user") {
      return true;
    }
    return availableSchools.includes(schoolId);
  };

  return (
    <div className="flex flex-row flex-wrap gap-5 w-full justify-center lg:justify-normal p-5">
      {schools?.map((school) => (
        <Button
          key={school._id}
          variant="outline"
          className={`w-40 h-40 lg:w-60 lg:h-60 rounded-xl flex flex-col items-center gap-5 ${
            haveAccess(school._id) ? "" : "opacity-10"
          }`}
          onClick={() => {
            if (haveAccess(school._id)) {
              router.push(`/store/${school._id}`);
            } else {
              toast.error(
                "No tienes menores a cargo registrados en este colegio"
              );
            }
          }}
        >
          <Avatar className="w-20 h-20 lg:w-28 lg:h-28">
            <AvatarImage
              src={school.imageUrl || "/placeholderimg.jpg"}
              alt={school.name}
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <div>
            <div className="font-semibold">{school.name}</div>
            <div className="text-sm text-gray-500">{school.name}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}

export default SchoolList;
