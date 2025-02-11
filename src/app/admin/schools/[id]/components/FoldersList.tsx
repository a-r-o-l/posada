import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFolder } from "@/models/Folder";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FolderDropDownMenu from "./FolderDropDownMenu";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { deleteFolder } from "@/server/folderAction";
import { toast } from "sonner";
import FolderModal from "./FolderModal";

const initialDeleteFolderState = {
  open: false,
  folderId: "",
};
const initialEditFolderState: {
  open: boolean;
  folder: IFolder | null;
  type: "edit" | "view";
} = {
  open: false,
  folder: null,
  type: "edit",
};

function FoldersList({
  folders,
  selectedFolder,
}: {
  folders?: IFolder[];
  selectedFolder?: IFolder;
}) {
  const router = useRouter();
  const [openDeleteFolderModal, setOpenDeleteFolderModal] = useState(
    initialDeleteFolderState
  );
  const [openEditFolderModal, setOpenEditFolderModal] = useState(
    initialEditFolderState
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  return (
    <ScrollArea className="h-[500px] pt-5">
      {!!folders?.length ? (
        folders?.map((folder) => {
          return (
            <Button
              key={folder._id}
              variant={
                selectedFolder?._id === folder._id ? "secondary" : "outline"
              }
              className="w-full justify-start text-left mb-2 py-10"
              onClick={() => {
                const currentUrl = new URL(window.location.href);
                const params = new URLSearchParams(currentUrl.search);
                params.set("folder", folder._id);
                router.push(`${currentUrl.pathname}?${params.toString()}`);
              }}
            >
              <div className="flex items-center space-x-2 w-full justify-between">
                <div className="flex items-center gap-5">
                  {folder.isPrivate ? <Lock /> : <></>}
                  <div>
                    <div className="font-semibold">{folder.title}</div>
                    <div className="text-sm text-gray-500">
                      {folder.description}
                    </div>
                  </div>
                </div>
                <FolderDropDownMenu
                  onClick={() => {
                    const currentUrl = new URL(window.location.href);
                    const params = new URLSearchParams(currentUrl.search);
                    params.set("folder", folder._id);
                    router.push(`${currentUrl.pathname}?${params.toString()}`);
                  }}
                  onDeleteClick={() =>
                    setOpenDeleteFolderModal({
                      open: true,
                      folderId: folder._id,
                    })
                  }
                  onEditClick={() =>
                    setOpenEditFolderModal({ open: true, folder, type: "edit" })
                  }
                  onViewClick={() => {
                    setOpenEditFolderModal({
                      open: true,
                      folder,
                      type: "view",
                    });
                  }}
                  title={folder.title}
                />
              </div>
            </Button>
          );
        })
      ) : (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-end  text-center cursor-pointer gap-3">
            <span className="mt-2 block text-sm font-medium text-gray-600">
              No hay carpetas
            </span>
          </div>
        </div>
      )}
      <CustomAlertDialog
        open={openDeleteFolderModal.open}
        onClose={() => setOpenDeleteFolderModal(initialDeleteFolderState)}
        title="Eliminar carpeta"
        description="¿Estás seguro que deseas eliminar esta carpeta?"
        loading={deleteLoading}
        onAccept={async () => {
          setDeleteLoading(true);
          const res = await deleteFolder(openDeleteFolderModal.folderId);
          if (res.success) {
            toast.success(res.message);
            setOpenDeleteFolderModal(initialDeleteFolderState);
          } else {
            toast.error(res.message);
          }
          setDeleteLoading(false);
        }}
      />
      <FolderModal
        open={openEditFolderModal.open}
        onClose={() => setOpenEditFolderModal(initialEditFolderState)}
        folder={openEditFolderModal.folder}
        type={openEditFolderModal.type}
      />
    </ScrollArea>
  );
}

export default FoldersList;
