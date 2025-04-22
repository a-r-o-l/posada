"use client";
import Image from "next/image";
import React, { useState } from "react";
import ProductTab from "./ProductTab";

const data = [
  {
    id: 1,
    title: "Archivos digitales",
    text: "Al confirmar el pago le enviaremos el/los archivo elegidos a tu whatsapp.",
    img: "/ui/products/13x18.jpeg",
  },
  {
    id: 2,
    title: "Carpeta",
    text: "Retrato y grupo en 20 x 25 cm + Multiple ( 2  billerera y 4 carnet de la misma foto de la carpeta).",
    img: "/ui/products/carpetaweb.png",
  },
  {
    id: 3,
    title: "Foto Book",
    text: `• Confeccionado 100% en papel fotográfico.
• Incluye el retrato individual y la foto grupal.
• Tapa dura con escudo del colegio.
• Tamaño abierto: 20 x 30 cm.
• 2 fotos tipo billetera y 4 tipo carnet del retrato elegido.
`,
    img: "/ui/products/bookweb.png",
  },
  {
    id: 4,
    title: "Fotos grupales",
    text: `Formato tradicional impreso.
    Archivo digital para compartir.`,
    img: "/ui/products/grupo.jpeg",
  },
  {
    id: 5,
    title: "Orla",
    text: `Orla impresa.
    Archivo digital para compartir.`,
    img: "/ui/products/orla.jpeg",
  },
  {
    id: 6,
    title: "Copias Impresas",
    text: `Tamaño de impresión:
    • 20 x 25 cm. 
    • 15 x 21 cm. 
    • 13 x 18 cm.
    • multiple (2 billetera + 4 carnet) del retrato elegido.`,
    img: "/ui/products/copiaspapelweb.png",
  },
];

function Section3() {
  const [selected, setSelected] = useState(data[0]);

  return (
    <div
      className="hidden lg:flex flex-col w-full relative mt-20"
      id="productos"
    >
      <div className="mb-10 text-center flex flex-col text-4xl sm:text-5xl lg:text-6xl pl-10 md:pl-20 leading-none">
        <h1 className="font-bold text-[#F9AE48]">
          <span className="text-black">Conocé nuestros</span>
          <span className="ml-3">productos</span>
        </h1>
      </div>
      <div className="absolute left-0">
        <Image
          src="/ui/seccion3/yellowbar.png"
          width={150}
          height={150}
          alt="section1"
          className="w-[2vw] max-w-[70px] min-w-[20px] min-h-[80vh] lg:min-h-[150px] object-cover"
        />
      </div>
      <div className="flex flex-1 justify-center items-center relative">
        <div className="w-4/5 bg-[#F9AE48] rounded-l-3xl absolute right-0 top-0 z-10 h-[70vh] lg:h-[55vh]"></div>
        <div className="w-[70vw]  border-2 border-[#F9AE48] bg-[#EFF0F9] rounded-3xl mt-10 z-20 flex flex-col h-[70vh] lg:h-[65vh]">
          <div className="grid grid-cols-1 lg:grid-cols-6 p-5 gap-5">
            {data.map((p) => (
              <ProductTab
                title={p.title}
                isSelected={selected.title === p.title}
                key={p.id}
                setIsSelected={() => setSelected(p)}
              />
            ))}
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center lg:py-20">
            <div className="border-8 border-gray-200 rounded-xl w-[400px] h-[300px]">
              <Image
                src={selected.img}
                width={300}
                height={300}
                alt={selected.title}
                className="object-contain rounded-lg w-full h-full"
              />
            </div>
            <div className="flex flex-col h-full mt-10 lg:m-0 px-10 lg:px-20 max-w-[35vw] pt-10">
              <h1 className="font-black text-[#F9AE48] text-3xl">
                {selected.title}
              </h1>
              <p className="whitespace-pre-line mt-2 text-lg">
                {selected.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section3;
