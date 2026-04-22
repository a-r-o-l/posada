import { getSchool } from "@/supabase/hooks/server/schools";
import SchoolStoreDetailClient from "./components/SchoolStoreDetailClient";

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
      <SchoolStoreDetailClient school={selectedSchool} />
    </div>
  );
}
