import React from "react";
import Section2 from "../components/rootsComponents/section2/Section2";
import Section3 from "../components/rootsComponents/section3/Section3";
// import RootHeader from "../components/rootsComponents/RootHeader";
import Section1 from "../components/rootsComponents/section1/Section1";
import Section4 from "../components/rootsComponents/section4/Section4";
// import Section5 from "../components/rootsComponents/section5/Section5";
import Section3Mini from "@/components/rootsComponents/section3/Section3Mini";
import MiniRootHeader from "@/components/rootsComponents/MiniRootHeader";
import Section1Mini from "@/components/rootsComponents/section1/Section1Mini";
import Section2Mini from "@/components/rootsComponents/section2/Section2Mini";
// import Section5Mini from "@/components/rootsComponents/section5/Section5Mini";
import WhatsAppLogo from "@/icons/whatsappsvg";
import Section6 from "@/components/rootsComponents/section6/Section6";
import Section6Mini from "@/components/rootsComponents/section6/Section6Mini";

const ready = false;

function page() {
  if (!ready) {
    return (
      <main className="flex flex-col flex-1 bg-[#F0F1FF]">
        {/* <RootHeader /> */}
        <MiniRootHeader />
        <div className="py-20" id="quienes-somos">
          <Section1 />
          <Section1Mini />
          <Section2 />
          <Section2Mini />
          <Section3 />
          <Section3Mini />
          <Section4 />
          <Section6 />
          <Section6Mini />
        </div>
        <div className="w-full bg-black p-5 flex flex-col mt-auto">
          <div className="w-full flex items-center justify-start">
            <div
              style={{ backgroundImage: "url(/logoposadawhite.png)" }}
              className="w-28 h-10 bg-contain bg-center bg-no-repeat"
            ></div>
          </div>
          <div className="flex flex-col mt-4 gap-1">
            <p className="text-xs text-gray-400 underline whitespace-nowrap font-bold">
              Contacto:
            </p>
            <div className="flex items-center gap-2">
              <WhatsAppLogo className="w-5 h-5" />
              <p className="text-white text-xs">+54 9 11 4143-4032</p>
            </div>
          </div>
          <div className="flex flex-col mt-4 gap-1 text-end">
            <p className="text-xs text-muted-foreground">
              © 2025 - Arol Alonso
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/5491141434032?text=Hola!%20Quiero%20hacer%20una%20consulta"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center p-4 transition-all"
          style={{ boxShadow: "0 4px 16px #0003" }}
        >
          <WhatsAppLogo className="w-8 h-8" />
        </a>
      </main>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-center px-4">
      <div
        style={{ backgroundImage: "url(/logoposada.png)" }}
        className="w-60 h-60 bg-contain bg-center bg-no-repeat"
      ></div>
      <h1 className="font-black text-5xl mt-4">🚧 Página en construcción</h1>
      <p className="text-lg text-gray-700 mt-4 max-w-md">
        Estamos trabajando para ofrecerte una mejor experiencia.
      </p>
      <p className="text-md text-gray-600 mt-2">
        📅 Vuelve pronto —{" "}
        <span className="font-semibold">Estimado: 30 de abril de 2026</span>
      </p>
      <div
        style={{ backgroundImage: "url(/underConstruction.png)" }}
        className="w-96 h-60 bg-contain bg-center bg-no-repeat mt-2"
      ></div>
    </div>
  );
}

export default page;
