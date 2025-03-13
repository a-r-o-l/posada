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
import { IFile } from "@/models/File";
import { Link, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { deleteFileInParentFolder } from "@/server/fileAction";
import { toast } from "sonner";

function ShowImgModal({
  img,
  open,
  onClose,
}: {
  img: IFile | null;
  open: boolean;
  onClose: () => void;
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

          {!!img?.imageUrl && (
            <div className="flex justify-center">
              <AspectRatio ratio={1 / 1} className="w-full rounded-xl">
                <Image
                  src={img?.imageUrl || ""}
                  alt={img?.title}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </div>
          )}
          <div className="flex justify-end w-full gap-5">
            <Button
              className="rounded-full"
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(img?.imageUrl || "", "_blank");
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
            const response = await deleteFileInParentFolder(img._id);
            if (response.success) {
              toast.success(response.message);
              setOpenAlert(false);
              setDeleting(false);
              onClose();
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
