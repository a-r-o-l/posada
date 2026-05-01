import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

interface UploadProofModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function UploadProofModal({
  open,
  onClose,
  onUpload,
}: UploadProofModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UploadCloud className="w-6 h-6 text-blue-500" />
            Subir comprobante de transferencia
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center gap-2">
          <label
            htmlFor="proof"
            className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2"
          >
            <UploadCloud className="w-5 h-5 text-blue-500" />
            <span>{file ? file.name : "Selecciona una imagen"}</span>
            <input
              id="proof"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
          >
            Subir comprobante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
