import { getOneFolder } from "@/server/folderAction";
import FolderStoreDetailClient from "./components/FolderStoreDetailClient";
import { getAllProductsById } from "@/server/productAction";
import { getSchool } from "@/server/schoolAction";

export default async function page({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const param = await params;
  const { folder } = await getOneFolder(param.folderId);
  const { products } = await getAllProductsById(folder.schoolId);
  const { school } = await getSchool(folder.schoolId);

  return (
    <div className="p-4 w-full bg-[#139FDC] h-[90vh]">
      <FolderStoreDetailClient
        folder={folder}
        products={products}
        school={school}
      />
    </div>
  );
}
