import React from "react";

function Section1() {
  return (
    <div className="hidden lg:flex flex-col w-full items-end relative">
      <div className="w-[87vw] lg:w-[47vw]  bg-[#139FDC] absolute right-0 h-20 z-10 rounded-l-3xl top-0"></div>
      <div className="flex flex-col items-start w-[90vw] lg:w-[50vw] justify-end border-[#139FDC] border-l-2 border-t-2 border-b-2 rounded-l-3xl p-7 lg:p-14 z-20 mt-5 bg-[#F0F1FF]">
        <div className="flex flex-col lg:w-4/6">
          <h1 className="font-black text-4xl">¿Quienes somos?</h1>
          <p className="mt-10">
            Somos una empresa familiar, dedicada durante mas de 40 años a la
            fotografía escolar, hemos entrado en sus hogares a través de los
            colegios, que depositaron su confianza en nosotros, para poder tener
            una memoria histórica gráfica y el mismo tiempo un recuerdo de una
            etapa irrepetible como es la escolar.
          </p>
          <p className="mt-10">
            Si usted no posee la contraseña para ingresar a su institución, por
            favor envíenos un mail a contacto@fotosposada.com.ar indicándonos
            colegio, nombre y curso del alumno.
          </p>
        </div>
      </div>
      <div
        style={{ backgroundImage: "url(/ui/seccion2/purplewave.png)" }}
        className="w-56 h-32 bg-contain bg-center bg-no-repeat"
      ></div>
    </div>
  );
}

export default Section1;
