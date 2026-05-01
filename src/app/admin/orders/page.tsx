import React from "react";
import OrdersClientSide from "./components/OrdersClientSide";
import { getSchools } from "@/supabase/hooks/server/schools";
import { getAllSalesByDate } from "@/supabase/hooks/server/sales";

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
  const { sales } = await getAllSalesByDate({ start, end, state, delivered });
  const schools = await getSchools();

  return (
    <div className="container mx-auto p-4">
      <OrdersClientSide sales={sales} schools={schools} />
    </div>
  );
}
