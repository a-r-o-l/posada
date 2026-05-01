import React from "react";
import OrderDetailClient from "./components/OrderDetailClient";
import { getSaleById } from "@/supabase/hooks/server/sales";

export default async function page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const { data: sale } = await getSaleById(orderId);
  return (
    <div className="container mx-auto p-4">
      <OrderDetailClient sale={sale} />
    </div>
  );
}
