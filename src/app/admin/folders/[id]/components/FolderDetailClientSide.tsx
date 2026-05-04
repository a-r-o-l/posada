"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useCallback, useEffect, useState } from "react";
import CreateFolderModal from "../../components/CreateFolderModal";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Folder as FolderIcon,
  Table2,
  ImageIcon,
} from "lucide-react";
import FileCreateModal from "./FileCreateModal";
import ShowImgModal from "./ShowImgModal";
import CustomAlertDialog from "@/components/CustomAlertDialog";
// import { deleteFolder } from "@/server/folderAction";
import { SchoolFullDetails } from "@/supabase/models/school";
import { Folder, FolderFullDetails } from "@/supabase/models/folder";
import { File, FileFullDetails } from "@/supabase/models/file";
import { Grade } from "@/supabase/models/grade";
import { useFolders } from "@/supabase/hooks/client/useFolders";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FilesTable from "./FilesTable";
import FilesList from "./FilesList";
import { useFiles } from "@/supabase/hooks/client/useFiles";

function FolderDetailClientSide({
  selectedSchool,
  selectedFolder,
  grades,
}: {
  selectedSchool?: SchoolFullDetails;
  folders?: Folder[];
  selectedFolder?: Folder;
  grades: Grade[];
}) {
  const router = useRouter();
  const { fetchFilesByFolderId, files, loading: queryLoading } = useFiles();
  const { deleteFolder } = useFolders();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [display, setDisplay] = useState("table");
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openShowModal, setOpenShowModal] = useState<File | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubfolder, setSelectedSubfolder] =
    useState<FolderFullDetails | null>(null);

  const refreshData = useCallback(() => {
    if (selectedFolder) {
      fetchFilesByFolderId(selectedFolder.id);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (selectedFolder) {
      refreshData();
    }
  }, [selectedFolder]);

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
            <ToggleGroup
              variant="outline"
              type="single"
              defaultValue="table"
              value={display}
              onValueChange={(e) => setDisplay(e)}
            >
              <ToggleGroupItem value="table" aria-label="Table">
                <Table2 size={16} />
              </ToggleGroupItem>
              <ToggleGroupItem value="image" aria-label="Image">
                <ImageIcon size={16} />
              </ToggleGroupItem>
            </ToggleGroup>
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
        {display === "table" && (
          <FilesTable
            files={files || []}
            loading={queryLoading}
            onRefresh={() => refreshData()}
          />
        )}
        {display === "image" && (
          <FilesList
            files={files || []}
            setOpenUploadModal={() => setOpenUploadModal(true)}
            setOpenShowModal={(file: FileFullDetails) => setOpenShowModal(file)}
          />
        )}
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
        onRefresh={() => refreshData()}
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
