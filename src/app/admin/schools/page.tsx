import React from "react";
import SchoolsClientSide from "./components/SchoolsClientSide";
import { getAllSchools } from "@/server/schoolAction";

export default async function page() {
  const { schools } = await getAllSchools();

  return (
    <div className="p-4 w-full">
      <SchoolsClientSide schools={schools} />
    </div>
  );
}
