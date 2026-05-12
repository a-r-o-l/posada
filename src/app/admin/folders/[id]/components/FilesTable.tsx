import CustomAlertDialog from "@/components/CustomAlertDialog";
import LoadingTable from "@/components/LoadingTable";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFiles } from "@/supabase/hooks/client/useFiles";
import { File } from "@/supabase/models/file";
import React, { useState } from "react";
import { toast } from "sonner";

function FilesTable({
  files,
  loading,
  onRefresh,
}: {
  files: File[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingMutation, setLoadingMutation] = useState(false);
  const { deleteManyFiles } = useFiles();

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
        <div className="flex items-center justify-around">
          <p>{files.length} archivos</p>
          <Button
            disabled={!selectedFiles.length}
            variant="destructive"
            onClick={() => setOpenAlert(true)}
          >
            Eliminar archivos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Archivo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Url</TableHead>
              <TableHead>Original url</TableHead>
              <TableHead>
                <Checkbox
                  disabled={!files.length}
                  checked={
                    selectedFiles.length === files.length && files.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // Seleccionar todos los archivos completos
                      setSelectedFiles([...files]);
                    } else {
                      // Limpiar selección
                      setSelectedFiles([]);
                    }
                  }}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingTable span={5} />
            ) : !!files?.length ? (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Avatar className="rounded-sm w-20 h-20">
                      <AvatarImage src={file.image_url || ""} />
                    </Avatar>
                  </TableCell>
                  <TableCell>{file.title}</TableCell>
                  <TableCell className="max-w-20 truncate">
                    {file.image_url}
                  </TableCell>
                  <TableCell className="max-w-20 truncate">
                    {file.original_image_url}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.some(
                        (selected) => selected.id === file.id,
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Agregar el archivo completo al array
                          setSelectedFiles([...selectedFiles, file]);
                        } else {
                          // Remover el archivo del array por id
                          setSelectedFiles(
                            selectedFiles.filter(
                              (selected) => selected.id !== file.id,
                            ),
                          );
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No hay archivos en esta carpeta
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CustomAlertDialog
        title="Eliminar archivos"
        description={`¿Estás seguro de que deseas eliminar ${selectedFiles.length} archivos? Esta acción no se puede deshacer.`}
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        loading={loadingMutation}
        onAccept={async () => {
          setLoadingMutation(true);
          const { success } = await deleteManyFiles(selectedFiles);
          if (success) {
            toast.success("Archivos eliminados correctamente");
            setSelectedFiles([]);
            setOpenAlert(false);
            onRefresh();
          } else {
            toast.error("Error al eliminar los archivos, intenta de nuevo");
            setOpenAlert(false);
          }
          setLoadingMutation(false);
        }}
      />
    </Card>
  );
}

export default FilesTable;
