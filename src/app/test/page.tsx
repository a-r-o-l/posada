import React from "react";
import Section2 from "./components/section2/Section2";
import Section3 from "./components/section3/Section3";
import TestHeader from "./components/TestHeader";
import Section1 from "./components/section1/Section1";
import Section4 from "./components/section4/Section4";
import Section5 from "./components/section5/Section5";

function page() {
  return (
    <div className="bg-bottom min-h-screen bg-[#F0F1FF]">
      <TestHeader />
      <div className="py-20" id="quienes-somos">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
      </div>
      <div className="w-full h-60 bg-black"></div>
    </div>
  );
}

export default page;
