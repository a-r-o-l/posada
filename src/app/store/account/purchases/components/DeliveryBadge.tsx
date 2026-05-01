import { Badge } from "@/components/ui/badge";
import React from "react";

function DeliveryBadge({ state }: { state: boolean }) {
  if (state === null || state === undefined) {
    return <></>;
  }

  if (!!state) {
    return (
      <Badge
        className="border-green-500 text-green-500 w-24 justify-center"
        variant="outline"
      >
        Entregado
      </Badge>
    );
  }
  return (
    <Badge
      className="w-24 justify-center border-blue-500 text-blue-500"
      variant="outline"
    >
      Pendiente
    </Badge>
  );
}

export default DeliveryBadge;
