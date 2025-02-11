import { getOneFolder } from "@/server/folderAction";
import FolderStoreDetailClient from "./components/FolderStoreDetailClient";
import { getAllProductsById } from "@/server/productAction";

export default async function page({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const param = await params;
  const { folder } = await getOneFolder(param.folderId);
  const { products } = await getAllProductsById(folder.schoolId);

  return (
    <div className="p-4 w-full">
      <FolderStoreDetailClient folder={folder} products={products} />
    </div>
  );
}
