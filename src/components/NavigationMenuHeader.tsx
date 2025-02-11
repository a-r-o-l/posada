"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Shield,
  ShoppingCart,
  Menu,
  X,
  Store,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ThemeButton } from "./ThemeButton";
import { useCartStore } from "@/zustand/useCartStore";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

function NavigationMenuHeader() {
  const cartItems = useCartStore((state) => state.products);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    {
      name: "Admin",
      href: "/login",
      icon: Shield,
    },
    { name: "Tienda", href: "/dashboard/store", icon: Store },
    { name: "Sobre Nosotros", href: "/about", icon: Users },
  ];

  return (
    <header className="shadow-md top-0 sticky z-50 bg-blue-600">
      <div className="px-5">
        <nav className="grid grid-cols-2 h-32 w-full md:grid-cols-3 items-center overflow-hidden">
          {/* <Link href="/dashboard" className="">
            <Avatar className="">
              <AvatarImage src={"/logo-posada.png"} alt="Logo Posada" />
            </Avatar>
          </Link> */}
          <Link href="/dashboard" className="">
            <div className="w-60 h-32 flex justify-center items-center ">
              <AspectRatio ratio={9 / 16}>
                <Image
                  src={"/posadalogowhite.png"}
                  alt="Logo Posada"
                  layout="fill"
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </div>
          </Link>

          <div className="hidden md:flex justify-between">
            {navItems.map((link) => {
              const isActive =
                link.href === "/" || link.href === "/dashboard"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  // className="text-gray-400 hover:text-gray-200 flex items-center gap-2"
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium gap-2 hover:text-gray-300",
                    isActive ? "text-blue" : "text-white"
                  )}
                >
                  {link.icon && <link.icon className="h-6 w-6" />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-10">
            {/* <ThemeButton /> */}
            <div className="relative">
              <Link href={"/dashboard/cart"}>
                <ShoppingCart className="h-6 w-6 text-white hover:text-gray-300" />
              </Link>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </span>
              )}
            </div>
            <ThemeButton />
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-4">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  {/* <div className="flex justify-between items-center py-4">
                    <span className="text-xl font-bold">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div> */}
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-600 hover:text-gray-800 py-2"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavigationMenuHeader;
