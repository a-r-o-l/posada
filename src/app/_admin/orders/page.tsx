import React from "react";
import OrdersClientSide from "./components/OrdersClientSide";
import { getAllSales } from "@/server/saleAction";
import { getAllSchools } from "@/server/schoolAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    state: string;
    start: string;
    end: string;
    delivered: string;
  }>;
}) {
  const { start, end, state, delivered } = await searchParams;
  const { sales } = await getAllSales(start, end, state, delivered);
  const { schools } = await getAllSchools();

  return (
    <div className="container mx-auto p-4">
      <OrdersClientSide sales={sales} schools={schools} />
    </div>
  );
}
