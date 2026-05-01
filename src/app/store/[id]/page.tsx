import { getSchool } from "@/supabase/hooks/server/schools";
import SchoolStoreDetailClient from "./components/SchoolStoreDetailClient";
import { Suspense } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ level?: string; year?: string }>;
}) {
  const param = await params;
  const { school: selectedSchool } = await getSchool(param.id);

  return (
    <div className="p-4 w-full bg-[#139FDC] h-[90vh]">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#139FDC]"></div>
          </div>
        }
      >
        <SchoolStoreDetailClient school={selectedSchool} />
      </Suspense>
    </div>
  );
}
