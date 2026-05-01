import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import React from "react";

interface TransferProofModalProps {
  open: boolean;
  proofUrl: string;
  onClose: () => void;
  onApprove: () => void;
  approving: boolean;
  isaproved?: boolean;
}

const TransferProofModal: React.FC<TransferProofModalProps> = ({
  open,
  proofUrl,
  onClose,
  onApprove,
  approving,
  isaproved,
}) => {
  const [zoomed, setZoomed] = React.useState(false);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 relative flex flex-col items-center"
        style={{
          minWidth: zoomed ? undefined : 360,
          maxWidth: zoomed ? undefined : 700,
          width: zoomed ? "100vw" : undefined,
          height: zoomed ? "100vh" : undefined,
          justifyContent: zoomed ? "center" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <NextImage
          src={proofUrl || "/placeholderimg.jpg"}
          alt="Comprobante ampliado"
          width={zoomed ? 1200 : 600}
          height={zoomed ? 1200 : 600}
          style={{
            borderRadius: 8,
            marginBottom: 16,
            objectFit: "contain",
            maxHeight: zoomed ? "90vh" : 500,
            maxWidth: zoomed ? "90vw" : "100%",
            cursor: "zoom-in",
            boxShadow: zoomed ? "0 0 0 4px #fff, 0 0 40px #0006" : undefined,
            transition: "all 0.2s",
          }}
          onClick={() => setZoomed((z) => !z)}
        />
        {!isaproved && !zoomed && (
          <Button
            onClick={onApprove}
            disabled={approving}
            className="w-full mt-2"
          >
            {approving ? "Aprobando..." : "Aprobar orden"}
          </Button>
        )}
        {!zoomed && (
          <Button
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            X
          </Button>
        )}
        {zoomed && (
          <Button
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => setZoomed(false)}
          >
            X
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransferProofModal;
