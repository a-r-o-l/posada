"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { School } from "@/supabase/models/school";

function SchoolList({ schools }: { schools: School[] }) {
  const router = useRouter();
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);

  // useEffect(() => {
  //   if (user?.id) {
  //     const searchAccount = async () => {
  //       const { account } = await getAccount(user.id, true);
  //       const schools = account.children.map((item: IChildren) => {
  //         console.log(item);
  //         return item.schoolId;
  //       });
  //       setAvailableSchools(schools);
  //     };
  //     searchAccount();
  //   }
  // }, [user]);

  return (
    <div className="flex flex-row flex-wrap gap-5 w-full justify-center lg:justify-normal p-5">
      {schools?.map((school) => (
        <Button
          key={school.id}
          variant="outline"
          className={`w-40 h-40 lg:w-60 lg:h-60 rounded-xl flex flex-col items-center gap-5`}
          onClick={() => {
            router.push(`/sstore/${school.id}`);
          }}
        >
          <Avatar className="w-20 h-20 lg:w-40 lg:h-40">
            <AvatarImage
              src={school.image_url || "/placeholderimg.jpg"}
              alt={school.name}
              className="object-contain !aspect-square p-1"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <div>
            <div className="font-semibold capitalize">{school.name}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}

export default SchoolList;
