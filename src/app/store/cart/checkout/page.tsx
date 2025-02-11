import React from "react";
import PaymentStatusComponent from "./components/PaymentStatusComponent";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ status: string[] }>;
}) {
  const param = await searchParams;

  const isSuccessful =
    param.status.includes("success") ||
    (param.status.includes("approved") as boolean);

  return (
    <div className="flex items-center justify-center p-4">
      <PaymentStatusComponent status={isSuccessful} />
    </div>
  );
}

export default page;
