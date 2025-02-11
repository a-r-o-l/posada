import { getSale } from "@/server/saleAction";
import React from "react";
import OrderDetailClient from "./components/OrderDetailClient";

export default async function page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const { sale } = await getSale(orderId);
  return (
    <div className="container mx-auto p-4">
      <OrderDetailClient sale={sale} />
    </div>
  );
}
