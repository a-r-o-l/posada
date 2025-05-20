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
import { ISchoolPopulated } from "@/models/School";
import CreateFolderModal from "../../components/CreateFolderModal";
import { useRouter } from "next/navigation";
import { IFolder } from "@/models/Folder";
import { ArrowLeft, Folder } from "lucide-react";
import { IFile } from "@/models/File";
import FileCreateModal from "./FileCreateModal";
import FileComponent from "./FileComponent";
import ShowImgModal from "./ShowImgModal";
import FolderComponent from "../../components/FolderComponent";
import { IGrade } from "@/models/Grade";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { deleteFolder } from "@/server/folderAction";
import { toast } from "sonner";

function FolderDetailClientSide({
  selectedSchool,
  folders,
  files,
  selectedFolder,
  grades,
}: {
  selectedSchool?: ISchoolPopulated;
  folders?: IFolder[];
  files?: IFile[];
  selectedFolder?: IFolder;
  grades: IGrade[];
}) {
  const router = useRouter();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openShowModal, setOpenShowModal] = useState<IFile | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubfolder, setSelectedSubfolder] = useState<IFolder | null>(
    null
  );

  console.log(selectedFolder);

  const onDeleteFolder = (folder: IFolder) => {
    setSelectedSubfolder(folder);
    setOpenAlert(true);
  };

  const onEditFolder = (folder: IFolder) => {
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
                    `/admin/folders?school=${selectedFolder?.schoolId}`
                  );
                }}
              >
                <ArrowLeft size={24} />
              </Button>
            </div>
            <Folder size={48} />
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
                      key={folder._id}
                      folder={folder}
                      onDeleteFolder={onDeleteFolder}
                      onEditFolder={onEditFolder}
                    />
                  ))}
                  {selectedFolder && !!files?.length ? (
                    files.map((file) => (
                      <FileComponent
                        key={file._id}
                        file={file}
                        onShowImage={(file: IFile) => setOpenShowModal(file)}
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
        schoolId={selectedFolder?.schoolId}
        parentFolder={selectedFolder?._id || ""}
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
          const response = await deleteFolder(selectedSubfolder._id);
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
