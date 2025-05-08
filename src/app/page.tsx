import React from "react";
import Section2 from "../components/rootsComponents/section2/Section2";
import Section3 from "../components/rootsComponents/section3/Section3";
import RootHeader from "../components/rootsComponents/RootHeader";
import Section1 from "../components/rootsComponents/section1/Section1";
import Section4 from "../components/rootsComponents/section4/Section4";
import Section5 from "../components/rootsComponents/section5/Section5";
import Section3Mini from "@/components/rootsComponents/section3/Section3Mini";
import MiniRootHeader from "@/components/rootsComponents/MiniRootHeader";
import Section1Mini from "@/components/rootsComponents/section1/Section1Mini";
import Section2Mini from "@/components/rootsComponents/section2/Section2Mini";
import Section5Mini from "@/components/rootsComponents/section5/Section5Mini";
import WhatsAppLogo from "@/icons/whatsappsvg";
import { Mail } from "lucide-react";
import Section6 from "@/components/rootsComponents/section6/Section6";
import Section6Mini from "@/components/rootsComponents/section6/Section6Mini";

const ready = true;

function page() {
  if (ready) {
    return (
      <main className="flex flex-col flex-1 bg-[#F0F1FF]">
        <RootHeader />
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
          <Section5 />
          <Section5Mini />
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
              <Mail className="w-5 h-5 text-white" />
              <p className="text-white text-xs">contacto@fotosposada.com.ar</p>
            </div>
            <div className="flex items-center gap-2">
              <WhatsAppLogo className="w-5 h-5" />
              <p className="text-white text-xs">+54 9 11 5403-2747</p>
            </div>
          </div>
          <div className="flex flex-col mt-4 gap-1 text-end">
            <p className="text-xs text-muted-foreground">
              © 2025 - Arol Alonso
            </p>
          </div>
        </div>
      </main>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div
        style={{ backgroundImage: "url(/logoposada.png)" }}
        className="w-60 h-60 bg-contain bg-center bg-no-repeat"
      ></div>
      <h1 className="font-black text-5xl text-center">
        Pagina en construccion
      </h1>
      <div
        style={{ backgroundImage: "url(/underConstruction.png)" }}
        className="w-96 h-60 bg-contain bg-center bg-no-repeat"
      ></div>
    </div>
  );
}

export default page;
