"use client";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";
import { usePathname } from "next/navigation";
import HeaderShoppingCart from "@/app/sstore/components/HeaderShoppingCart";
import { useAuthStore } from "@/zustand/auth-store";

const hideNavbarRoutes = ["login", "/update-password"];

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
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <Link href="/" className="">
            <div
              style={{ backgroundImage: "url(/logoposadawhite.png)" }}
              className="w-52 h-16 bg-cover bg-center"
            ></div>
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-8 items-center">
            <Link
              href="/"
              className="text-neutral-200 hover:text-white transition-colors duration-300 font-medium"
            >
              Inicio
            </Link>
            <Link
              href="#nuestro-trabajo"
              className="text-neutral-200 hover:text-white transition-colors duration-300 font-medium"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className="text-neutral-200 hover:text-white transition-colors duration-300 font-medium"
            >
              Contacto
            </Link>
            <UserDropdown />

            {currentUser && <HeaderShoppingCart />}
          </div>
        </div>
      </div>
    </nav>
  );
}
