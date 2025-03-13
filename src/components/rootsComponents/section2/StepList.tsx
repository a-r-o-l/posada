import React from "react";
import StepCard from "./StepCard";

const steps = [
  {
    number: 1,
    title: "Accede",
    content:
      "Crea tu cuenta de usuario si aún no tienes una haciendo click aquí.",
    circleColor: "bg-[#139FDC]",
    titleColor: "text-[#139FDC]",
    classname: "lg:col-span-2 z-10",
  },
  {
    number: 2,
    title: "Hace tu pedido",
    content: `Accede a la tienda y consulta nuestro catálogo.
    Elige el producto y las fotografías que deseas.`,
    circleColor: "bg-[#8DB946]",
    titleColor: "text-[#8DB946]",
    classname: "lg:col-span-2 z-10",
  },
  {
    number: 3,
    title: "Abona",
    content: "Abona con MercadoPago, transferencia o efectivo.",
    circleColor: "bg-[#F9AE48]",
    titleColor: "text-[#F9AE48]",
    classname: "lg:col-span-2 z-10",
  },
  {
    number: 4,
    title: "Producción",
    content:
      "Nuestro laboratorio recibe y completa tu pedido.Podrás ver el estado en todo momento.",
    circleColor: "bg-[#E02130]",
    titleColor: "text-[#AC292F]",
    classname: "lg:col-start-2 lg:col-span-2 z-10",
  },
  {
    number: 5,
    title: "Recibe o recoge tu pedido",
    content:
      "Elige entre recoger el pedido en nuestros talleres o recibirlo cómodamente en tu domicilio.",
    circleColor: "bg-[#812E8A]",
    titleColor: "text-[#812E8A]",
    classname: "lg:col-start-4 lg:col-span-2 z-10",
  },
];

function StepList() {
  return (
    <>
      <div className="hidden py-10 gap-y-10 w-full md:grid grid-cols-2 lg:grid-cols-6 place-items-center relative">
        <div
          style={{ backgroundImage: 'url("/ui/LINEA.png")' }}
          className="absolute w-4/5 bg-contain h-96 bg-repeat-space bg-center z-0 block"
        ></div>
        {steps.map((step) => (
          <StepCard key={step.number} item={step} />
        ))}
      </div>
      <div
        style={{ backgroundImage: 'url("/ui/SECCION2-full2.jpg")' }}
        className="bg-contain sm:bg-cover bg-center bg-no-repeat h-96 w-full relative md:hidden"
      ></div>
    </>
  );
}

export default StepList;
