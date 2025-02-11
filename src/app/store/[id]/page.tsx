import { getSchool } from "@/server/schoolAction";
import SchoolStoreDetailClient from "./components/SchoolStoreDetailClient";
import { getAllFolders } from "@/server/folderAction";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const { school: selectedSchool } = await getSchool(param.id);
  const { folders } = await getAllFolders(param.id);

  return (
    <div className="p-4 w-full">
      <SchoolStoreDetailClient school={selectedSchool} folders={folders} />
    </div>
  );
}
