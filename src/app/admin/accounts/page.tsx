import React from "react";
import AccountsClientSide from "./components/AccountsClientSide";
import { searchProfiles } from "@/supabase/hooks/server/profiles";
import { getStudents } from "@/supabase/hooks/server/students";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const search = await searchParams;
  const accounts = await searchProfiles(search.search || "");
  const students = await getStudents();

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
