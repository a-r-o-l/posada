import React from "react";
import PurchasesClientComponent from "./components/PurchasesClientComponent";
import AccountNav from "../components/AccountNav";

async function page() {
  return (
    <div className="py-10 container mx-auto">
      <AccountNav value="purchases" />
      <div className="mt-5">
        <PurchasesClientComponent />
      </div>
    </div>
  );
}

export default page;
