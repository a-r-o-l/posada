"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import CreateSchoolModal from "./CreateSchoolModal";
import SchoolButton from "./SchoolButton";
import { School } from "@/supabase/models/school";

function SchoolsClientSide({ schools }: { schools: School[] }) {
  const [openSchoolModal, setOpenSchoolModal] = useState(false);
  const [editSchool, setEditSchool] = useState<School | null>(null);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center justify-between w-full">
          <CardTitle>Colegios</CardTitle>
          <Button variant="link" onClick={() => setOpenSchoolModal(true)}>
            Registrar colegio
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex gap-5 flex-wrap">
        {schools?.length ? (
          schools?.map((school) => (
            <SchoolButton
              key={school.id}
              school={school}
              onEdit={() => {
                setEditSchool(school);
                setOpenSchoolModal(true);
              }}
            />
          ))
        ) : (
          <div className="w-full h-60 flex items-center justify-center">
            <span className="mt-2 block text-sm font-medium text-muted-foreground">
              No hay colegios
            </span>
          </div>
        )}
      </CardContent>
      <CreateSchoolModal
        open={openSchoolModal}
        onClose={() => setOpenSchoolModal(false)}
        editSchool={editSchool}
      />
    </Card>
  );
}

export default SchoolsClientSide;
