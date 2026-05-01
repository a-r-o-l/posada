import React from "react";
import { getAllSchools } from "@/server/schoolAction";
import SchoolsClientSide from "./components/SchoolsClientSide";

export default async function page() {
  const { schools } = await getAllSchools();

  return (
    <div className="p-4 w-full">
      <SchoolsClientSide schools={schools} />
    </div>
  );
}
