import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

function Section4() {
  return (
    <div className="flex flex-col mt-10" id="nuestro-trabajo">
      <div
        style={{ backgroundImage: "url(/ui/seccion4/yellowwave.png)" }}
        className="w-[10vw] h-[1vh] md:h-[4vh] bg-contain bg-center bg-no-repeat"
      ></div>
      <div
        style={{ backgroundImage: "url(/ui/seccion4/yellowwave.png)" }}
        className="w-[10vw] h-[1vh] md:h-[4vh] bg-contain bg-center bg-no-repeat"
      ></div>
      <div>
        <h1 className="text-4xl font-black text-center lg:text-start lg:ml-20  mt-10 sm:text-5xl lg:text-6xl">
          <span className="text-[#1D1D1B]">Confian en</span>
          <span className="text-[#AC292F] ml-3">Nosotros</span>
        </h1>
      </div>
      <div className="w-full flex justify-between px-20 mt-10 lg:mt-10">
        <div className="rounded-full bg-[#AC292F] text-white flex items-center justify-center p-2">
          <ChevronLeft size={30} />
        </div>
        <div className="rounded-full bg-[#AC292F] text-white flex items-center justify-center p-2">
          <ChevronRight size={30} />
        </div>
      </div>
      <div className="bg-[#AC292F] w-[15vw] md:w-[5vw] h-[5vh] rounded-r-full mt-5 md:mt-10"></div>
      <div className="w-full rounded-3xl bg-[#AC292F] h-[55vh] mt-10"></div>
    </div>
  );
}

export default Section4;
