import React from "react";
import ServicesClientSide from "./components/ServicesClientSide";

export default async function page() {
  return (
    <div className="p-4 w-full mx-auto container flex flex-col gap-5">
      <ServicesClientSide />
    </div>
  );
}
