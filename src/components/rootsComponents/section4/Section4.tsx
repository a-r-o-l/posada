import React from "react";
import SchoolsCarrousel from "./SchoolsCarrousel";
const data = [
  {
    id: 1,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/BDS+escudo.jpg",
  },
  {
    id: 2,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/CRISTOFOLO+COLOMBO.png",
  },
  {
    id: 3,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/florida100.jpeg",
  },
  {
    id: 4,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/FRANKLIN.png",
  },
  {
    id: 5,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/JACA+nuevo+logo-jaca-tressecciones-trescolores-CV.png",
  },
  {
    id: 6,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/moruli60.jpeg",
  },
  {
    id: 7,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/escudo+garcia+tranparente.jpg",
  },
  {
    id: 8,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/SAINT+GEORGES.png",
  },
  {
    id: 9,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/STANFORD+COLLEGE.png",
  },
  {
    id: 10,
    src: "https://fotosposada.s3.us-east-2.amazonaws.com/school/uhs.PNG",
  },
];

function Section4() {
  return (
    <div className="flex flex-col mt-20" id="nuestro-trabajo">
      <div
        style={{ backgroundImage: "url(/ui/seccion4/yellowwave.png)" }}
        className="w-[10vw] h-[1vh] md:h-[4vh] bg-contain bg-center bg-no-repeat"
      ></div>
      <div
        style={{ backgroundImage: "url(/ui/seccion4/yellowwave.png)" }}
        className="w-[10vw] h-[1vh] md:h-[4vh] bg-contain bg-center bg-no-repeat"
      ></div>
      <div>
        <h1 className="text-3xl font-black text-center lg:text-start lg:ml-20  mt-10 sm:text-5xl lg:text-6xl">
          <span className="text-[#1D1D1B]">Confian en</span>
          <span className="text-[#AC292F] ml-3">Nosotros</span>
        </h1>
      </div>
      {/* <div className="w-full flex justify-between px-20 mt-10 lg:mt-10">
        <div className="rounded-full bg-[#AC292F] text-white flex items-center justify-center p-2">
          <ChevronLeft size={30} />
        </div>
        <div className="rounded-full bg-[#AC292F] text-white flex items-center justify-center p-2">
          <ChevronRight size={30} />
        </div>
      </div> */}
      <div className="bg-[#AC292F] w-[15vw] md:w-[5vw] h-[5vh] rounded-r-full mt-5 md:mt-10"></div>
      {/* <div className="w-full rounded-3xl bg-[#AC292F] mt-10">
        <div className="flex flex-wrap justify-center items-center w-full p-1">
          {data.map((item) => (
            <div
              key={item.id}
              style={{ backgroundImage: `url(${item.src})` }}
              className="w-32 h-20 bg-contain bg-center bg-no-repeat"
            ></div>
          ))}
        </div>
      </div> */}
      <SchoolsCarrousel images={data} />
    </div>
  );
}

export default Section4;
