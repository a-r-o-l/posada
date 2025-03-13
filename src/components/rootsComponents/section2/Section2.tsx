import Image from "next/image";
import React from "react";

function Section2() {
  return (
    <div className="flex flex-col w-full relative" id="servicio">
      <div className="flex flex-row justify-between w-full">
        <div className="flex">
          <div className="flex flex-col text-4xl sm:text-5xl lg:text-6xl pl-10 md:pl-20 leading-none">
            <h1 className="font-bold text-[#1D1D1B]">¡Hace tu</h1>
            <h1 className="font-bold text-[#8DB946] ml-20">pedido!</h1>
          </div>
          <div className="place-content-center">
            <Image
              src="/ui/seccion2/purplewave.png"
              width={150}
              height={150}
              alt="section1"
              className="w-[10vw] max-w-[300px] min-w-[80px] h-auto ml-5"
              priority
            />
          </div>
        </div>
        <div className="">
          <Image
            src="/ui/seccion2/path76.png"
            width={150}
            height={150}
            alt="section1"
            className="w-[10vw] max-w-[300px] min-w-[80px] h-auto"
            priority
          />
        </div>
      </div>
      <div className="w-full h-full relative place-items-center pt-10">
        <Image
          src="/ui/seccion2/stepper.png"
          width={5000}
          height={500}
          alt="section1"
          className="w-[450px] sm:w-[90vw] md:w-[90vw] lg:w-[90vw] xl:w-[80vw] h-auto relative z-20"
        />
        <Image
          src="/ui/seccion2/path75.png"
          width={150}
          height={150}
          alt="section1"
          className="w-[15vw] max-w-[300px] min-w-[100px] h-auto absolute top-0 left-0 z-10"
        />
      </div>
      <div className="w-full relative place-items-center">
        <Image
          src="/ui/seccion2/doublepurplewave.png"
          width={150}
          height={150}
          alt="section1"
          className="w-[10vw] max-w-[600px] min-w-[200px] h-auto ml-5"
          priority
        />
      </div>
    </div>
  );
}

export default Section2;
