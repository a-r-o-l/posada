import { Badge } from "@/components/ui/badge";
import React from "react";

function DeliveryBadge({ state }: { state: boolean }) {
  if (state === null || state === undefined) {
    return <></>;
  }

  if (!!state) {
    return (
      <Badge
        className="w-20 text-xs border-green-500 text-green-500 md:w-24 md:text-base justify-center"
        variant="outline"
      >
        Entregado
      </Badge>
    );
  }
  return (
    <Badge
      className="w-20 text-xs md:w-24 justify-center border-blue-500 text-blue-500 md:text-base"
      variant="outline"
    >
      Pendiente
    </Badge>
  );
}

export default DeliveryBadge;
