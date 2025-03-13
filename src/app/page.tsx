import React from "react";
import Section2 from "../components/rootsComponents/section2/Section2";
import Section3 from "../components/rootsComponents/section3/Section3";
import RootHeader from "../components/rootsComponents/RootHeader";
import Section1 from "../components/rootsComponents/section1/Section1";
import Section4 from "../components/rootsComponents/section4/Section4";
import Section5 from "../components/rootsComponents/section5/Section5";
import Section3Mini from "@/components/rootsComponents/section3/Section3Mini";

function page() {
  return (
    <div className="bg-bottom min-h-screen bg-[#F0F1FF]">
      <RootHeader />
      <div className="py-20" id="quienes-somos">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section3Mini />
        <Section4 />
        <Section5 />
      </div>
      <div className="w-full h-60 bg-black"></div>
    </div>
  );
}

export default page;
