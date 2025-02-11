"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "./LoadingButton";

type AlertDialogProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  onCancel?: () => void;
  CancelTitle?: string;
  AcceptTitle?: string;
  description: string;
  title: string;
  loading?: boolean;
};

function CustomAlertDialog({
  open,
  onClose,
  onAccept,
  onCancel,
  CancelTitle,
  AcceptTitle,
  description,
  title,
  loading,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            title={AcceptTitle || "Aceptar"}
            loading={loading}
            onClick={() => {
              onAccept();
            }}
          />

          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onCancel) {
                onCancel();
              } else {
                onClose();
              }
            }}
          >
            {CancelTitle || "Cancelar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CustomAlertDialog;
