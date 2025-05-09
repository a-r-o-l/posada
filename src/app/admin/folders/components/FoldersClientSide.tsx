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
import { PartialSchool } from "@/models/School";
import SchoolsSelect from "./SchoolsSelect";
import CreateFolderModal from "./CreateFolderModal";
import { IFolder } from "@/models/Folder";
import { nameParser } from "@/lib/utilsFunctions";
import { IGrade } from "@/models/Grade";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { deleteFolder } from "@/server/folderAction";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import LevelSelect from "./LevelSelect";
import YearSelect from "./YearSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FolderDropDownMenu from "./FolderDropDownMenu";
import { useRouter } from "next/navigation";
import { Lock, LockOpen } from "lucide-react";

function FoldersClientSide({
  schools,
  selectedSchool,
  folders,
  grades,
}: {
  schools: PartialSchool[];
  selectedSchool?: string;
  folders: IFolder[] | [];
  grades: IGrade[];
}) {
  const router = useRouter();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);

  const onDeleteFolder = (folder: IFolder) => {
    setSelectedFolder(folder);
    setOpenAlert(true);
  };

  const onEditFolder = (folder: IFolder) => {
    setSelectedFolder(folder);
    setOpenFolderModal(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Carpetas</CardTitle>
          <Button
            disabled={!selectedSchool}
            onClick={() => setOpenFolderModal(true)}
          >
            Crear carpeta
          </Button>
        </div>
        <CardDescription>Ver y administrar carpetas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5 justify-evenly">
          <div className="w-60 space-y-3">
            <Label>Colegio</Label>
            <SchoolsSelect url="/admin/folders" schools={schools} />
          </div>
          <div className="w-60 space-y-3">
            <Label>Nivel</Label>
            <LevelSelect url="/admin/folders" />
          </div>
          <div className="w-60 space-y-3">
            <Label>Año</Label>
            <YearSelect url="/admin/folders" />
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-5 w-full py-10 mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Privada</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xl">
              {!!folders?.length ? (
                folders?.map((folder) => (
                  <TableRow
                    key={folder._id}
                    className="hover:cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(`/admin/folders/${folder._id}`);
                    }}
                  >
                    <TableCell className="text-gray-900  text-base">
                      {nameParser(folder.title)}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {folder.level}
                    </TableCell>
                    <TableCell className="text-gray-700 text-base">
                      {folder.year || new Date().getFullYear().toString()}
                    </TableCell>
                    <TableCell>
                      {folder.isPrivate ? (
                        <Lock className="text-red-500" />
                      ) : (
                        <LockOpen className="text-green-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700" align="right">
                      <FolderDropDownMenu
                        onClick={() => {}}
                        title={folder.title}
                        onEditClick={() => onEditFolder(folder)}
                        onDeleteClick={() => onDeleteFolder(folder)}
                        onViewClick={() =>
                          router.push(`/admin/folders/${folder._id}`)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground text-sm text-center h-60"
                  >
                    No hay carpetas creadas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex flex-row flex-wrap gap-5 w-full py-10 mt-10">
          {!!folders?.length ? (
            folders?.map((folder) => (
              <FolderComponent
                key={folder._id}
                folder={folder}
                onDeleteFolder={onDeleteFolder}
                onEditFolder={onEditFolder}
              />
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <p className="text-muted-foreground text-sm">
                No hay carpetas creadas
              </p>
            </div>
          )}
        </div> */}
      </CardContent>
      <CreateFolderModal
        open={openFolderModal}
        onClose={() => {
          setOpenFolderModal(false);
          setSelectedFolder(null);
        }}
        schoolId={selectedSchool}
        grades={grades}
        folder={selectedFolder}
        modalTitle={selectedFolder ? "Editar carpeta" : "Crear carpeta"}
        btnTitle={selectedFolder ? "Guardar" : "Crear"}
        modalDescription={`Rellena los campos para ${
          selectedFolder ? "editar" : "crear"
        } una carpeta`}
      />
      <CustomAlertDialog
        title="Eliminar carpeta"
        description="¿Estás seguro de que deseas eliminar esta carpeta?"
        open={openAlert}
        loading={loading}
        onClose={() => {
          setSelectedFolder(null);
          setOpenAlert(false);
        }}
        onAccept={async () => {
          if (!selectedFolder) return;
          setLoading(true);
          const response = await deleteFolder(selectedFolder?._id);
          if (response.success) {
            toast.success(response.message);
            setSelectedFolder(null);
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

export default FoldersClientSide;
