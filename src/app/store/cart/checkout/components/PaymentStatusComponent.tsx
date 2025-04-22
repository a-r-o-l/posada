"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Frown, Smile } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useRouter } from "next/navigation";

function PaymentStatusComponent({ status }: { status: boolean }) {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const { height, width } = useWindowSize();

  useEffect(() => {
    setDimensions({ height, width });
  }, [height, width]);

  const isSuccessful = useMemo(() => {
    return status;
  }, [status]);

  if (isSuccessful) {
    return (
      <div
        className="flex flex-col justify-center items-center text-center"
        style={{ height: dimensions.height ? dimensions.height - 200 : "auto" }}
      >
        <div className="flex flex-col gap-5 w-3/4">
          <div className="flex justify-center items-center text-green-500">
            <Smile size={64} />
          </div>
          <h1 className="font-bold text-5xl text-green-500">
            GRACIAS POR TU COMPRA
          </h1>
          <h3 className="text-muted-foreground">
            en breve te enviaremos un email con el comprobante y con los
            detalles del envio.
          </h3>
          <div className="flex flex-col gap-5 px-20 mt-10">
            <Button onClick={() => router.push("/store")}>
              <ArrowLeft />
              Volver a la tienda
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/store/purchases")}
            >
              Ir a mis compras
            </Button>
          </div>
        </div>
        <Confetti
          width={width - 50}
          height={height}
          numberOfPieces={250}
          initialVelocityY={1000}
        />
      </div>
    );
  }
  return (
    <div
      className="flex flex-col justify-center items-center text-center"
      style={{ height: dimensions.height ? dimensions.height - 200 : "auto" }}
    >
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
          desde la navegacion o en el boton ubicado abajo.
        </h3>
        <div className="flex flex-col gap-5 px-20 mt-10">
          <Button onClick={() => router.push("/store")}>
            <ArrowLeft />
            Volver a la tienda
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/store/purchases")}
          >
            Ir a mis compras
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatusComponent;
