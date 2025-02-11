import { getAllSchools } from "@/server/schoolAction";
import React from "react";
import SchoolList from "./components/SchoolList";

export default async function page() {
  const { schools } = await getAllSchools();

  return (
    <div className="flex flex-col items-center p-10">
      <SchoolList schools={schools} />
    </div>
  );
}
