import React from "react";
import MigrationStudents from "../components/MigrationStudents";

export default async function page() {
  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-5">
      <MigrationStudents />
    </div>
  );
}
