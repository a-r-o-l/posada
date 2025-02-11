import React from "react";
import OrdersClientSide from "./components/OrdersClientSide";
import { getAllSales } from "@/server/saleAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    state: string;
    start: string;
    end: string;
  }>;
}) {
  const { start, end, state } = await searchParams;
  const { sales } = await getAllSales(start, end, state);

  return (
    <div className="container mx-auto p-4">
      <OrdersClientSide sales={sales} />
    </div>
  );
}
