"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function RootHeader() {
  return (
    <header className="hidden lg:block shadow-md top-0 sticky z-50 bg-[#F0F1FF]">
      <div className="px-5">
        <nav className="flex flex-col md:flex-row items-center justify-between p-2">
          <Link href="/" className="">
            <div
              style={{ backgroundImage: "url(/logoposada.png)" }}
              className="w-40 h-20 bg-cover bg-center"
            ></div>
          </Link>
          <div className="w-full flex items-end justify-center px-5">
            <div className="w-full flex items-center justify-between lg:justify-end lg:gap-20">
              <Link href="#quienes-somos" className="text-base hidden lg:block">
                Quienes somos
              </Link>
              <Link href="#servicio" className="text-base hidden lg:block">
                Servicio
              </Link>
              <Link href="#productos" className="text-base hidden lg:block">
                Productos
              </Link>
              <Link
                href="#nuestro-trabajo"
                className="text-base hidden lg:block"
              >
                Nuestro trabajo
              </Link>
              <Link href="#contacto" className="text-base hidden lg:block">
                Contacto
              </Link>
              <Link href="/signin" className="text-base lg:block">
                Iniciar sesión
              </Link>
              <Button className="bg-[#139FDC] rounded-full w-28 h-12 text-base">
                Registrate
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default RootHeader;
