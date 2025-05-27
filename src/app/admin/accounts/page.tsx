import React from "react";
import AccountsClientSide from "./components/AccountsClientSide";
import { searchAccounts } from "@/server/accountAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const search = await searchParams;
  const { accounts } = await searchAccounts(search.search || "");
  return (
    <div className="container mx-auto p-4">
      <AccountsClientSide accounts={accounts} />
    </div>
  );
}
