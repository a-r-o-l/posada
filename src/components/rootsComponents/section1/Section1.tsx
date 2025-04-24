import Image from "next/image";
import React from "react";

function Section1() {
  return (
    <div className="hidden lg:flex flex-col w-full items-end relative">
      <div className="w-[87vw] lg:w-[77vw] bg-[#139FDC] absolute right-0 h-20 z-10 rounded-l-3xl top-0" />
      <div className="flex flex-col items-start w-[90vw] lg:w-[80vw] justify-end border-[#139FDC] border-l-2 border-t-2 border-b-2 rounded-l-3xl p-7 lg:p-14 z-20 mt-5 bg-[#F0F1FF]">
        <div className="flex flex-row lg:w-full h-full justify-between items-center gap-20">
          <div className="rounded-3xl w-[1200px] h-[300px] overflow-hidden">
            <Image
              src={"/ui/seccion1/img4.jpeg"}
              width={1000}
              height={300}
              alt="Quienes somos"
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-4xl mt-10">¿Quienes somos?</h1>
            <p className="mt-10 text-lg whitespace-pre-line">
              Somos una empresa familiar con más de 40 años de experiencia en
              fotografía escolar. A lo largo de estas décadas, tuvimos el honor
              de entrar a sus hogares a través de las instituciones educativas
              que confiaron en nosotros, permitiéndonos construir una memoria
              gráfica de momentos únicos e irrepetibles: los años escolares.
            </p>
            <p className="mt-10 text-lg font-bold">
              ¿No tenés la contraseña para ingresar a tu colegio?
            </p>
            <p className="text-lg whitespace-pre-line leading-none">
              {`
              Escribinos por WhatsApp al +54 911 5403-2747\n 
  indicando:\n
  • Nombre del colegio\n
  • Nombre del alumno\n
  • Curso\n
  Así podremos ayudarte rápidamente.`}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{ backgroundImage: "url(/ui/seccion2/purplewave.png)" }}
        className="w-56 h-32 bg-contain bg-center bg-no-repeat"
      />
    </div>
  );
}

export default Section1;
