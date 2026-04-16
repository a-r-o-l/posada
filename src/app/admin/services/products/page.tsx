import React from "react";
import MigrationProducts from "../components/MigrationProducts";

export default async function page() {
  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-5">
      <MigrationProducts />
    </div>
  );
}
