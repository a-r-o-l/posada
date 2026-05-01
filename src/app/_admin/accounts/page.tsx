import React from "react";
import AccountsClientSide from "./components/AccountsClientSide";
import { searchAccounts } from "@/server/accountAction";
import { getAllStudents } from "@/server/studentAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const search = await searchParams;
  const { accounts } = await searchAccounts(search.search || "");
  const { students } = await getAllStudents();
  return (
    <div className="container mx-auto p-4">
      <AccountsClientSide
        accounts={accounts}
        students={students}
        key={Date.now()}
      />
    </div>
  );
}
