import { getSale } from "@/server/saleAction";
import React from "react";
import PurchaseDetailClient from "./components/PurchaseDetailClient";

async function page({ params }: { params: Promise<{ saleId: string }> }) {
  const { saleId } = await params;
  const { sale } = await getSale(saleId);

  return (
    <div className="container mx-auto p-4">
      <PurchaseDetailClient sale={sale} />
    </div>
  );
}

export default page;
