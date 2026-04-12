import React from "react";
import PicturesClient from "./components/PicturesClient";

async function page() {
  return (
    <div className="container mx-auto p-4">
      <PicturesClient />
    </div>
  );
}

export default page;
