"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Frown, Smile } from "lucide-react";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";

function PaymentStatusComponent({
  status,
  type,
}: {
  status: boolean;
  type?: string;
}) {
  const router = useRouter();

  const isSuccessful = useMemo(() => {
    return status;
  }, [status]);

  if (isSuccessful) {
    return (
      <div className="flex flex-col justify-center items-center text-center pt-20">
        <div className="flex flex-col gap-5 max-w-xl">
          <div className="flex justify-center items-center text-green-500">
            <Smile size={64} />
          </div>
          <h1 className="font-bold text-5xl text-green-500">
            GRACIAS POR TU COMPRA
          </h1>
          {type === "transfer" ? (
            <h3 className="text-muted-foreground">
              {`Una vez que confirmemos el pago, procesaremos tu pedido y te enviaremos un email con el comprobante y los detalles del envío.
            Si no subiste el comprobante, puedes hacerlo desde el botón "Ir a mis compras"`}
            </h3>
          ) : (
            <h3 className="text-muted-foreground">
              en breve te enviaremos un email con el comprobante y con los
              detalles del envío.
            </h3>
          )}
          <div className="flex flex-col gap-5 px-20 mt-10 max-w-xl">
            <Button onClick={() => router.push("/store")}>
              <ArrowLeft />
              Volver a la tienda
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/store/account/purchases")}
            >
              Ir a mis compras
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <div className="flex flex-col gap-5 w-3/4">
        <div className="flex justify-center items-center text-red-500">
          <Frown size={64} />
        </div>
        <h1 className="font-bold text-5xl text-red-500">PAGO PENDIENTE</h1>
        <h3 className="text-muted-foreground">
          No se realizo correctamente el pago, la compra quedara como pendiente
          hasta que realices el pago.
          <br /> Puedes abonar en otro momento ingresando a{" "}
          <span className="text-black font-black">{`mis compras`} </span>
          <br />
          desde la navegacion o en el botón ubicado abajo.
        </h3>
        <div className="flex flex-col gap-5 px-20 mt-10">
          <Button onClick={() => router.push("/store")}>
            <ArrowLeft />
            Volver a la tienda
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/store/account/purchases")}
          >
            Ir a mis compras
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatusComponent;
