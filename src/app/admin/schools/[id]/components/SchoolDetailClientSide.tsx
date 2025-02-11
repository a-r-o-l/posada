"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { ISchoolPopulated } from "@/models/School";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateFolderModal from "../../components/CreateFolderModal";
import { useRouter } from "next/navigation";
import { IFolder } from "@/models/Folder";
import { ArrowLeft } from "lucide-react";
import { IFile } from "@/models/File";
import FoldersList from "./FoldersList";
import FileCreateModal from "./FileCreateModal";
import FileComponent from "./FileComponent";
import ShowImgModal from "./ShowImgModal";

function SchoolDetailClientSide({
  selectedSchool,
  folders,
  files,
  selectedFolder,
}: {
  selectedSchool?: ISchoolPopulated;
  folders?: IFolder[];
  files?: IFile[];
  selectedFolder?: IFolder;
}) {
  const router = useRouter();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openShowModal, setOpenShowModal] = useState<IFile | null>(null);
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-20 flex justify-start items-start">
            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={() => router.push("/admin/schools")}
            >
              <ArrowLeft size={24} />
            </Button>
          </div>
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={selectedSchool?.imageUrl}
              alt={selectedSchool?.name}
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{selectedSchool?.name}</CardTitle>
            <CardDescription>{selectedSchool?.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Carpetas</CardTitle>
                <Button
                  variant="link"
                  disabled={!selectedSchool}
                  onClick={() => setOpenFolderModal(true)}
                >
                  Crear carpeta
                </Button>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent>
              <FoldersList folders={folders} selectedFolder={selectedFolder} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Archivos</CardTitle>
                <Button
                  onClick={() => setOpenUploadModal(true)}
                  variant="link"
                  disabled={!selectedFolder}
                >
                  Subir archivos
                </Button>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent>
              <div>
                <div className="flex flex-wrap gap-5 py-5">
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
        onClose={() => setOpenFolderModal(false)}
        schoolId={selectedSchool?._id}
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
    </Card>
  );
}

export default SchoolDetailClientSide;
