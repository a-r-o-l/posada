"use client";
import Link from "next/link";
import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { Button } from "./ui/button";
import { ThemeButton } from "./ThemeButton";
import { useTheme } from "next-themes";

function LandingHeader() {
  const theme = useTheme();
  const isDark = theme.theme === "dark";
  return (
    <header className="shadow-md top-0 sticky z-50 bg-sky-200 dark:bg-black bg-opacity-50 backdrop-blur-3xl">
      <div className="px-5">
        <nav className="flex flex-col md:flex-row items-center overflow-hidden p-2">
          <Link href="/" className="">
            <div className="w-60 h-32 flex justify-center items-center">
              <AspectRatio ratio={21 / 9}>
                <Image
                  src={isDark ? "/posadalogowhite.png" : "/posadalogoblack.png"}
                  alt="Logo Posada"
                  layout="fill"
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </div>
          </Link>
          <div className="w-full flex items-center justify-between px-5">
            <div className="w-full hidden lg:flex items-center gap-10">
              <Link
                href="#cfunciona"
                className="text-xl italic dark:text-white"
              >
                Como funciona?
              </Link>
              <Link href="/dashboard" className="text-xl dark:text-white">
                Sobre nosotros
              </Link>
            </div>
            <div className="w-full flex items-center justify-between md:justify-end gap-10">
              <Link href="/signin" className="text-xl dark:text-white">
                Iniciar sesión
              </Link>
              <Link href="/signup">
                <div className="relative inline-block p-1 bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-500 rounded-lg">
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative rounded-lg px-6 py-3 bg-sky-200 dark:bg-black"
                  >
                    Únete
                  </Button>
                </div>
              </Link>
              <div className="hidden md:flex items-center">
                <ThemeButton />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default LandingHeader;
