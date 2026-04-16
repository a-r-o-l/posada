import React from "react";
import MigrationGrades from "../components/MigrationGrades";

export default async function page() {
  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-5">
      <MigrationGrades />
    </div>
  );
}
