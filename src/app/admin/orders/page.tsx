import React from "react";
import OrdersClientSide from "./components/OrdersClientSide";
import { getSchools } from "@/supabase/hooks/server/schools";

export default async function page() {
  const schools = await getSchools();

  return (
    <div className="container mx-auto p-4">
      <OrdersClientSide schools={schools} />
    </div>
  );
}
