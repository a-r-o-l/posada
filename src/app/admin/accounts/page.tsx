import React from "react";
import AccountsClientSide from "./components/AccountsClientSide";
import { getAllAccounts } from "@/server/accountAction";

export default async function page() {
  const { accounts } = await getAllAccounts();
  return (
    <div className="container mx-auto p-4">
      <AccountsClientSide accounts={accounts} />
    </div>
  );
}
