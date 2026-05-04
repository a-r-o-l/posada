"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { School } from "@/supabase/models/school";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/zustand/auth-store";

function SchoolList({ schools }: { schools: School[] }) {
  const { currentUser } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
            if (currentUser?.role === "admin") {
              router.push(`/store/${school.id}`);
            }
            setOpen(true);
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 pb-10" showCloseButton={false}>
          <DialogHeader className="p-0">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div
              style={{ backgroundImage: "url(/logoposada.png)" }}
              className="w-60 h-60 bg-contain bg-center bg-no-repeat"
            ></div>
            <h1 className="font-black text-5xl mt-4">
              🚧 Tienda en construcción
            </h1>
            <p className="text-lg text-gray-700 mt-4 max-w-md">
              Estamos trabajando para ofrecerte una mejor experiencia.
            </p>
            <p className="text-md text-gray-600 mt-2">📅 Vuelve pronto </p>
            <div
              style={{ backgroundImage: "url(/underConstruction.png)" }}
              className="w-96 h-60 bg-contain bg-center bg-no-repeat mt-2"
            ></div>
            <div className="w-full">
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SchoolList;
