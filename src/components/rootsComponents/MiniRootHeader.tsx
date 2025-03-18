"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function MiniRootHeader() {
  return (
    <header className="shadow-md top-0 sticky z-50 bg-[#F0F1FF] lg:hidden">
      <nav className="flex flex-row items-center justify-between px-2 py-2">
        <Link href="/" className="">
          <div
            style={{ backgroundImage: "url(/logoposada.png)" }}
            className="w-32 h-12 bg-cover bg-center"
          ></div>
        </Link>
        <div className="w-full flex items-center justify-end gap-5">
          <Link href="/signin" className="text-base lg:block">
            Iniciar sesión
          </Link>
          <Button className="bg-[#139FDC] rounded-full w-28 h-10 text-base">
            Registrate
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default MiniRootHeader;
