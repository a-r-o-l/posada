import React from "react";
import AccountsClientSide from "./components/AccountsClientSide";
import { searchProfiles } from "@/supabase/hooks/server/profiles";
import { getSchools } from "@/supabase/hooks/server/schools";

export const dynamic = "force-dynamic";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const search = await searchParams;
  const accounts = await searchProfiles(search.search || "");
  const schools = await getSchools();

  return (
    <div className="container mx-auto p-4">
      <AccountsClientSide
        accounts={accounts}
        schools={schools || []}
        // key={Date.now()}
      />
    </div>
  );
}
