"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { PartialSchool } from "@/models/School";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateSchoolModal from "./CreateSchoolModal";
import { useRouter } from "next/navigation";

function SchoolsClientSide({ schools }: { schools: PartialSchool[] }) {
  const router = useRouter();
  const [openSchoolModal, setOpenSchoolModal] = useState(false);
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Colegios</CardTitle>
          <Button variant="default" onClick={() => setOpenSchoolModal(true)}>
            Crear colegio
          </Button>
        </div>
        <CardDescription>Ver y administrar colegios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap gap-5 w-full">
          {schools?.map((school) => (
            <Button
              key={school._id}
              variant="outline"
              className="w-60 h-60 rounded-xl flex flex-col items-center gap-5"
              onClick={() => router.push(`/admin/schools/${school._id}`)}
            >
              <Avatar className="w-28 h-28">
                <AvatarImage src={school.imageUrl} alt={school.name} />
                <AvatarFallback></AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold">{school.name}</div>
                <div className="text-sm text-gray-500">{school.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
      <CreateSchoolModal
        open={openSchoolModal}
        onClose={() => setOpenSchoolModal(false)}
      />
    </Card>
  );
}

export default SchoolsClientSide;
