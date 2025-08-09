import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote, UploadCloud } from "lucide-react";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (proofFile?: File) => void;
}

const ALIAS = "fotosposada";
const TITULAR = "Hilda Cristina Posada / Marcelo F. Posada";
const CBU = "0150525201000003002981";
const BANCO = "ICBC";

export default function TransferModal({
  open,
  onClose,
  total,
  onConfirm,
}: TransferModalProps) {
  const [proof, setProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    setUploading(true);
    await onConfirm(proof || undefined);
    setUploading(false);
    setProof(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Banknote className="w-6 h-6 text-green-500" />
            Pago por transferencia
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          <div>
            <span className="font-semibold">Alias:</span>{" "}
            <span className="text-blue-600">{ALIAS}</span>
          </div>
          <div>
            <span className="font-semibold">Titular:</span>{" "}
            <span className="text-gray-700">{TITULAR}</span>
          </div>
          <div>
            <span className="font-semibold">CBU:</span>{" "}
            <span className="text-gray-700">{CBU}</span>
          </div>
          <div>
            <span className="font-semibold">Banco:</span>{" "}
            <span className="text-gray-700">{BANCO}</span>
          </div>
          <div>
            <span className="font-semibold">Monto a depositar:</span>{" "}
            <span className="text-green-700 font-bold">$ {total}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2">
          <label
            htmlFor="proof"
            className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2"
          >
            <UploadCloud className="w-5 h-5 text-blue-500" />
            <span>{proof ? proof.name : "Subir comprobante"}</span>
            <input
              id="proof"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Si confirmás la compra sin subir el comprobante, podrás hacerlo más
            adelante desde la sección{" "}
            <span className="font-semibold text-blue-600">Mis compras</span>.
          </p>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={uploading}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white"
          >
            Confirmar compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
