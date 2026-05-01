import { Badge } from "@/components/ui/badge";
import React from "react";

interface PaymentBadgeProps {
  state: string;
  paymentTypeId?: string;
  transferProofUrl?: string;
}

function PaymentBadge({
  state,
  paymentTypeId,
  transferProofUrl,
}: PaymentBadgeProps) {
  if (!state) {
    return <></>;
  }

  if (state === "approved") {
    return (
      <Badge
        className="border-green-500 text-green-500 w-24 justify-center"
        variant="outline"
      >
        Pagado
      </Badge>
    );
  }
  // Estado especial para transferencias con comprobante subido pero aún pendiente
  if (state === "pending" && paymentTypeId === "transfer" && transferProofUrl) {
    return (
      <Badge
        className="w-24 justify-center border-yellow-500 text-yellow-500"
        variant="outline"
      >
        En proceso
      </Badge>
    );
  }
  if (state === "pending") {
    return (
      <Badge
        className="w-24 justify-center border-blue-500 text-blue-500"
        variant="outline"
      >
        Pendiente
      </Badge>
    );
  }
  if (state === "cancelled") {
    return (
      <Badge
        className="w-24 justify-center border-red-500 text-red-500"
        variant="outline"
      >
        Cancelado
      </Badge>
    );
  }
  return (
    <Badge
      className="w-24 justify-center border-red-500 text-red-500"
      variant="outline"
    >
      Rechazado
    </Badge>
  );
}

export default PaymentBadge;
