"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import CreateFolderModal from "../../components/CreateFolderModal";
import { useRouter } from "next/navigation";
import { ArrowLeft, Folder as FolderIcon } from "lucide-react";
import FileCreateModal from "./FileCreateModal";
import FileComponent from "./FileComponent";
import ShowImgModal from "./ShowImgModal";
import FolderComponent from "../../components/FolderComponent";
import CustomAlertDialog from "@/components/CustomAlertDialog";
// import { deleteFolder } from "@/server/folderAction";
import { SchoolFullDetails } from "@/supabase/models/school";
import { Folder, FolderFullDetails } from "@/supabase/models/folder";
import { File, FileFullDetails } from "@/supabase/models/file";
import { Grade } from "@/supabase/models/grade";
import { useFolders } from "@/supabase/hooks/client/useFolders";
import { toast } from "sonner";

function FolderDetailClientSide({
  selectedSchool,
  folders,
  files,
  selectedFolder,
  grades,
}: {
  selectedSchool?: SchoolFullDetails;
  folders?: Folder[];
  files?: File[];
  selectedFolder?: Folder;
  grades: Grade[];
}) {
  const router = useRouter();
  const { deleteFolder } = useFolders();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openShowModal, setOpenShowModal] = useState<File | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubfolder, setSelectedSubfolder] =
    useState<FolderFullDetails | null>(null);

  const onDeleteFolder = (folder: FolderFullDetails) => {
    setSelectedSubfolder(folder);
    setOpenAlert(true);
  };

  const onEditFolder = (folder: FolderFullDetails) => {
    setSelectedSubfolder(folder);
    setOpenFolderModal(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="h-20 flex justify-start items-start">
              <Button
                className="rounded-full"
                size="icon"
                variant="outline"
                onClick={() => {
                  router.push(
                    `/admin/folders?school=${selectedFolder?.school_id}`,
                  );
                }}
              >
                <ArrowLeft size={24} />
              </Button>
            </div>
            <FolderIcon size={48} />
            <div>
              <CardTitle>{selectedFolder?.title}</CardTitle>
              <CardDescription>{selectedSchool?.description}</CardDescription>
            </div>
          </div>
          <div>
            <Button
              onClick={() => setOpenUploadModal(true)}
              variant="link"
              disabled={!selectedFolder}
            >
              Subir archivos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle></CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex flex-wrap gap-5 py-5">
                  {folders?.map((folder) => (
                    <FolderComponent
                      key={folder.id}
                      folder={folder}
                      onDeleteFolder={onDeleteFolder}
                      onEditFolder={onEditFolder}
                    />
                  ))}
                  {selectedFolder && !!files?.length ? (
                    files.map((file) => (
                      <FileComponent
                        key={file.id}
                        file={file}
                        onShowImage={(file: FileFullDetails) =>
                          setOpenShowModal(file)
                        }
                      />
                    ))
                  ) : (
                    <div className="w-full h-60 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-end  text-center cursor-pointer gap-3">
                        <span className="mt-2 block text-sm font-medium text-gray-600">
                          No hay archivos en esta carpeta
                        </span>
                        <Button
                          onClick={() => setOpenUploadModal(true)}
                          variant="link"
                        >
                          Subir archivos
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CreateFolderModal
        open={openFolderModal}
        onClose={() => {
          setOpenFolderModal(false);
          setSelectedSubfolder(null);
        }}
        schoolId={selectedFolder?.school_id}
        parentFolder={selectedFolder?.id || ""}
        type="child"
        grades={grades}
        folder={selectedSubfolder}
        modalTitle={selectedSubfolder ? "Editar carpeta" : "Crear carpeta"}
        modalDescription={
          selectedSubfolder
            ? "Edita la información de una carpeta"
            : "Ingresa la información de la nueva carpeta"
        }
        btnTitle={selectedSubfolder ? "Guardar" : "Crear"}
      />
      <FileCreateModal
        folder={selectedFolder}
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
      <ShowImgModal
        img={openShowModal}
        open={!!openShowModal}
        onClose={() => setOpenShowModal(null)}
      />
      <CustomAlertDialog
        title="Eliminar carpeta"
        description="¿Estás seguro de que deseas eliminar esta carpeta?"
        open={openAlert}
        loading={loading}
        onClose={() => {
          setSelectedSubfolder(null);
          setOpenAlert(false);
        }}
        onAccept={async () => {
          if (!selectedSubfolder) return;
          setLoading(true);
          const response = await deleteFolder(selectedSubfolder.id);
          if (response.success) {
            toast.success(response.message);
            setSelectedSubfolder(null);
            setOpenAlert(false);
          } else {
            toast.error(response.message);
          }
          setLoading(false);
        }}
      />
    </Card>
  );
}

export default FolderDetailClientSide;
