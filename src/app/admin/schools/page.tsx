import React from "react";
import SchoolsClientSide from "./components/SchoolsClientSide";
import { getSchools } from "@/supabase/hooks/server/schools";

export default async function page() {
  const schools = await getSchools();

  return (
    <div className="p-4 w-full">
      <SchoolsClientSide schools={schools} />
    </div>
  );
}
