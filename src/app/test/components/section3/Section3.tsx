"use client";
import Image from "next/image";
import React, { useState } from "react";
import ProductTab from "./ProductTab";

const data = [
  {
    id: 1,
    title: "Archivos digitales",
    text: "Al confirmar el pago le enviaremos el/los archivo elegidos.",
  },
  {
    id: 2,
    title: "Carpeta",
    text: "Retrato y grupo en 20x25 cm + Multiple ( 2  billerera y 4 carnet de la misma foto de la carpeta).",
  },
  {
    id: 3,
    title: "Foto libro",
    text: "En tapa dura con escudo del colegio, con retrato y grupo en 15x21 cm + Multiple ( 2  billerera y 4 carnet de la misma foto del foto-book) Todo en papel fotográfico.",
  },
  {
    id: 4,
    title: "Foto grupales y orlas",
    text: "Formato tradicional, divertida u orla Archivo digital para compartir.",
  },

  {
    id: 5,
    title: "Copias papel",
    text: "",
  },
];

function Section3() {
  const [selected, setSelected] = useState(data[0]);

  return (
    <div className="flex flex-col w-full relative  mt-20" id="productos">
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
        <div className="w-4/5 bg-[#F9AE48] rounded-l-3xl absolute right-0 top-0 z-10 h-[100vh] lg:h-[55vh]"></div>
        <div className="w-[70vw]  border-2 border-[#F9AE48] bg-[#EFF0F9] rounded-3xl mt-10 z-20 flex flex-col h-[100vh] lg:h-[65vh]">
          <div className="grid grid-cols-1 lg:grid-cols-5 p-5 gap-5">
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
            <div className="flex flex-1 h-full w-full justify-center lg:justify-end items-center">
              <div className="border-2">
                <Image
                  src="/s-uhs.jpg"
                  width={400}
                  height={400}
                  alt="section1"
                />
              </div>
            </div>
            <div className="flex flex-col h-full mt-10 lg:m-0 lg:w-1/2 px-10 lg:px-20 justify-center">
              <h1 className="font-black text-[#F9AE48] text-2xl">
                {selected.title}
              </h1>
              <p className="">{selected.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section3;
