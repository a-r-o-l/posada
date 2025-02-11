import { Camera } from "lucide-react";
import React from "react";

function LogoComponent() {
  return (
    <div className="flex justify-evenly items-center gap-1 border-4 border-gray-700 py-1 px-4 rounded-full bg-black text-white">
      <p className="font-black text-2xl italic">P</p>
      <Camera className="h-4 w-4 mb-1" />
      {/* <p className="font-thin text-sm italic">O</p> */}
      <p className="font-thin text-sm">S</p>
      <p className="font-thin text-sm">A</p>
      <p className="font-thin text-sm">D</p>
      <p className="font-thin text-sm italic">A</p>
    </div>
  );
}

export default LogoComponent;
