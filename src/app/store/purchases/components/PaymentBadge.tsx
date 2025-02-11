import { Badge } from "@/components/ui/badge";
import React from "react";

function PaymentBadge({ state }: { state: string }) {
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
