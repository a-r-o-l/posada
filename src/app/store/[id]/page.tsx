import { getSchool } from "@/server/schoolAction";
import SchoolStoreDetailClient from "./components/SchoolStoreDetailClient";
import { getAllFolders } from "@/server/folderAction";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ level?: string; year?: string }>;
}) {
  const param = await params;
  const sp = await searchParams;
  const { school: selectedSchool } = await getSchool(param.id);
  const { folders } = await getAllFolders(
    param.id,
    sp.level,
    sp.year,
    true,
    "parent"
  );

  return (
    <div className="p-4 w-full bg-[#139FDC] h-[90vh]">
      <SchoolStoreDetailClient
        school={selectedSchool}
        folders={folders}
        level={sp?.level || ""}
      />
    </div>
  );
}
