import React from "react";
import PaymentStatusComponent from "./components/PaymentStatusComponent";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ status: string[]; type: string }>;
}) {
  const param = await searchParams;
  const isSuccessful =
    param?.status?.includes("success") ||
    (param?.status?.includes("approved") as boolean);

  const type = param?.type;

  return (
    <div className="flex items-center justify-center p-4">
      <PaymentStatusComponent status={isSuccessful} type={type} />
    </div>
  );
}

export default page;
