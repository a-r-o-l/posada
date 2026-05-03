import React from "react";
import PicturesClient from "./components/PicturesClient";
import AccountNav from "../components/AccountNav";

async function page() {
  return (
    <div className="py-10 container mx-auto">
      <AccountNav value="pictures" />
      <div className="mt-5">
        <PicturesClient />
      </div>
    </div>
  );
}

export default page;
