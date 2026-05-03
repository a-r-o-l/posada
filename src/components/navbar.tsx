"use client";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";
import { usePathname } from "next/navigation";
import HeaderShoppingCart from "@/app/store/components/HeaderShoppingCart";
import { useAuthStore } from "@/zustand/auth-store";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const hideNavbarRoutes = ["login", "/update-password", "/admin"];

export default function Navbar() {
  const { currentUser } = useAuthStore();
  const pathname = usePathname();
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="bg-neutral-950 border-neutral-700 border-b">
      <div className="container mx-auto px-4">
        {/* Primera fila: Logo + acciones */}
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center h-12 md:h-16">
            <div
              style={{ backgroundImage: "url(/logoposadawhite.png)" }}
              className="h-full aspect-auto bg-contain bg-center bg-no-repeat min-w-[100px] md:min-w-[150px]"
            ></div>
          </Link>

          <div className="hidden md:flex justify-center space-x-8 py-3">
            <Link
              href="/"
              className={cn(
                "transition-colors duration-300 font-medium",
                pathname === "/"
                  ? "text-white"
                  : "text-neutral-400 hover:text-white",
              )}
            >
              Inicio
            </Link>
            {!currentUser && (
              <Link
                href="/#nuestro-trabajo"
                className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium"
              >
                Sobre Nosotros
              </Link>
            )}
            {!currentUser && (
              <Link
                href="/#contacto"
                className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium"
              >
                Contacto
              </Link>
            )}
            {currentUser && (
              <Link
                href="/store/pictures"
                className={cn(
                  "transition-colors duration-300 font-medium",
                  pathname === "/store/pictures"
                    ? "text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Mis Fotos
              </Link>
            )}
            {currentUser && (
              <Link
                href="/store/account"
                className={cn(
                  "transition-colors duration-300 font-medium",
                  pathname === "/store/account"
                    ? "text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Cuenta
              </Link>
            )}
            {currentUser && (
              <Link
                href="/store"
                className={cn(
                  "transition-colors duration-300 font-medium",
                  pathname === "/store"
                    ? "text-white font-semibold"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Tienda
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <div className="flex space-x-4 items-center">
                  <div className="w-20 h-10 bg-neutral-700 rounded animate-pulse"></div>
                  <div className="w-24 h-10 bg-neutral-700 rounded animate-pulse"></div>
                </div>
              }
            >
              <UserDropdown />
            </Suspense>
            {currentUser && <HeaderShoppingCart />}
          </div>
        </div>

        {/* Desktop Links */}

        {/* Mobile Links */}
        <div className="md:hidden border-t border-neutral-700 mt-2 pt-3 pb-2 overflow-x-auto">
          <div className="flex gap-6 px-2 whitespace-nowrap">
            <Link
              href="/"
              className={cn(
                "transition-colors duration-300 font-medium text-sm",
                pathname === "/"
                  ? "text-white"
                  : "text-neutral-400 hover:text-white",
              )}
            >
              Inicio
            </Link>
            {!currentUser && (
              <Link
                href="/#nuestro-trabajo"
                className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium text-sm"
              >
                Sobre Nosotros
              </Link>
            )}
            {!currentUser && (
              <Link
                href="/#contacto"
                className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium text-sm"
              >
                Contacto
              </Link>
            )}
            {currentUser && (
              <Link
                href="/store/pictures"
                className={cn(
                  "transition-colors duration-300 font-medium text-sm",
                  pathname === "/store/pictures"
                    ? "text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Mis Fotos
              </Link>
            )}
            {currentUser && (
              <Link
                href="/store/account"
                className={cn(
                  "transition-colors duration-300 font-medium text-sm",
                  pathname === "/store/account"
                    ? "text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Mi Cuenta
              </Link>
            )}
            {currentUser && (
              <Link
                href="/store"
                className={cn(
                  "transition-colors duration-300 font-medium text-sm",
                  pathname === "/store"
                    ? "text-white font-semibold"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                Tienda
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
