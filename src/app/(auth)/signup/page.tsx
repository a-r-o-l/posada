import React from "react";
import SignUpForm from "./components/SignUpForm";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-60 h-32 flex justify-center items-center">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={"/posadalogowhite.png"}
            alt="Logo Posada"
            layout="fill"
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
      </div>
      <SignUpForm />
    </div>
  );
}
