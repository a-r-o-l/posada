import FolderStoreDetailClient from "./components/FolderStoreDetailClient";

export default async function page({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const param = await params;

  return (
    <div className="p-4 w-full bg-[#139FDC] h-[90vh]">
      <FolderStoreDetailClient folderId={param.folderId} />
    </div>
  );
}
