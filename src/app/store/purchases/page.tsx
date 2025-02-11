import React from "react";
import PurchasesClientComponent from "./components/PurchasesClientComponent";

async function page() {
  return (
    <div className="container mx-auto p-4">
      <PurchasesClientComponent />
    </div>
  );
}

export default page;
