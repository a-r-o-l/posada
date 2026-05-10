"use client";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { FileFullDetails } from "@/supabase/models/file";
import { useFiles } from "@/supabase/hooks/client/useFiles";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function ShowImgModal({
  img,
  open,
  onClose,
  onRefresh,
}: {
  img: FileFullDetails | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { deleteFile, updateFile } = useFiles();

  if (!img) {
    return <></>;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{img?.title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {!!img?.image_url && (
            <div className="flex justify-center">
              <AspectRatio ratio={1 / 1} className="w-full rounded-xl">
                <Image
                  src={img?.image_url || "/placeholderimg.jpg"}
                  alt={img?.title}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </div>
          )}
          <div className="flex justify-between w-full gap-5">
            <div className="flex items-center gap-2">
              <Label>Es grupal?</Label>
              <Switch
                checked={img.is_group || false}
                onCheckedChange={async () => {
                  const { success } = await updateFile(img.id, {
                    is_group: !img.is_group,
                  });
                  if (success) {
                    toast.success("Archivo actualizado");
                    onClose();
                    onRefresh();
                    // router.refresh();
                  } else {
                    toast.error("Error al actualizar el archivo");
                  }
                }}
              />
            </div>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(img?.image_url || "", "_blank");
              }}
            >
              <Link />
            </Button>
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => setOpenAlert(true)}
            >
              <Trash2 />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <CustomAlertDialog
        title="Eliminar archivo"
        description="¿Estás seguro de que deseas eliminar este archivo?"
        open={openAlert}
        loading={deleting}
        onAccept={async () => {
          try {
            setDeleting(true);
            const response = await deleteFile(img.id);
            if (response.success) {
              toast.success(response.message);
              setOpenAlert(false);
              setDeleting(false);
              onClose();
              router.refresh();
            } else {
              toast.error(response.message);
              setOpenAlert(false);
              setDeleting(false);
            }
          } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el archivo, intente nuevamente");
            setDeleting(false);
          }
        }}
        onClose={() => setOpenAlert(false)}
      />
    </>
  );
}

export default ShowImgModal;
