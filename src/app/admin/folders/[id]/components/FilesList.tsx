import { FileFullDetails } from "@/supabase/models/file";
import React from "react";
import FileComponent from "./FileComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function FilesList({
  files,
  setOpenShowModal,
  setOpenUploadModal,
}: {
  files: FileFullDetails[];
  setOpenShowModal: (file: FileFullDetails) => void;
  setOpenUploadModal: (open: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-5 py-5">
            {!!files?.length ? (
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
        </CardContent>
      </Card>
    </div>
  );
}

export default FilesList;
