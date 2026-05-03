"use client";

import Link from "next/link";
import { LogOut, User, Crown, Store } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginModal from "./LoginModal";
import { Button } from "./ui/button";
import RegisterModal from "./RegisterModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import ForgetPasswordModal from "./ForgetPasswordModal";

export function UserDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFPModal, setOpenFPModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const loginParam = searchParams.get("login");

  useEffect(() => {
    if (loginParam === "true") {
      setOpenLoginModal(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      router.replace(url.pathname, { scroll: false });
    }
  }, [loginParam, router]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  // Si no está autenticado, mostrar botones de login/registro
  const handleLogout = async () => {
    await logout();
  };

  const handleOpenLogoutDialog = () => {
    setDropdownOpen(false); // Cierra el dropdown primero
    setTimeout(() => {
      setOpen(true); // Abre el diálogo después de que el dropdown se cierre
    }, 100);
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex space-x-4 items-center">
        <Button
          variant="link"
          className="text-neutral-200 hover:text-white transition-colors duration-300 font-medium"
          onClick={() => {
            setOpenLoginModal(true);
          }}
        >
          Iniciar Sesión
        </Button>
        <Button
          className="bg-[#139FDC] text-white px-4 py-2 rounded-lg hover:bg-[#139FDC] transition-colors duration-300 font-medium"
          onClick={() => {
            setOpenRegisterModal(true);
          }}
        >
          Registrarse
        </Button>
        <LoginModal
          open={openLoginModal}
          onOpenChange={(open) => {
            setOpenLoginModal(open);
          }}
          switchModal={() => {
            setOpenLoginModal(false);
            setOpenRegisterModal(true);
          }}
          additionalAction={() => {
            setOpenLoginModal(false);
            setOpenFPModal(true);
          }}
        />
        <RegisterModal
          open={openRegisterModal}
          onOpenChange={(open) => {
            setOpenRegisterModal(open);
          }}
          switchModal={() => {
            setOpenRegisterModal(false);
            setOpenLoginModal(true);
          }}
        />
        <ForgetPasswordModal open={openFPModal} setOpen={setOpenFPModal} />
      </div>
    );
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-[#139FDC] rounded-full">
          <Avatar className="w-10 h-10 md:w-12 md:h-12 cursor-pointer hover:ring-2 hover:ring-[#139FDC] transition-all duration-200">
            <AvatarImage src={currentUser.image_url} />
            <AvatarFallback className="bg-[#139FDC] text-black font-bold text-lg">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 bg-neutral-900 border-neutral-700">
        <DropdownMenuLabel className="text-white">
          <div className="flex flex-col space-y-1">
            <div className="w-full flex items-center justify-between">
              <p className="text-sm font-medium">{currentUser.name}</p>
              {currentUser.role === "user" && (
                <span className="text-xs bg-[#139FDC] text-black px-2 py-0.5 rounded-full">
                  Usuario
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400">{currentUser.email}</p>

            {currentUser.role === "admin" && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                Admin
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-700" />
        <DropdownMenuItem
          asChild
          className="flex items-center space-x-2 text-neutral-300 data-[highlighted]:text-neutral-400 data-[highlighted]:bg-neutral-900 cursor-pointer transition-colors duration-200"
        >
          <Link href={"/store/account"}>
            <User className="h-4 w-4 text-neutral-300" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="flex items-center space-x-2 text-neutral-300 data-[highlighted]:text-neutral-400 data-[highlighted]:bg-neutral-900 cursor-pointer transition-colors duration-200"
        >
          <Link href={"/store"}>
            <Store className="h-4 w-4 text-neutral-300" />
            <span>Tienda</span>
          </Link>
        </DropdownMenuItem>
        {currentUser.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin/"
              className="flex items-center space-x-2 text-neutral-200 hover:text-white hover:bg-neutral-800 cursor-pointer"
            >
              <Crown className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-neutral-700" />
        <DropdownMenuItem
          onClick={handleOpenLogoutDialog}
          className="flex items-center space-x-2 text-red-400 data-[highlighted]:text-red-300 data-[highlighted]:bg-red-900 cursor-pointer transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 text-red-400 hover:text-red-300" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Cerrar sesión</DialogTitle>
            <DialogDescription className="text-neutral-400">
              ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a
              iniciar sesión para acceder a tu cuenta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2 pt-10">
            <Button
              className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                handleLogout();
                router.push("/");
              }}
              className="bg-red-900 hover:bg-red-700 text-red-400 data-[highlighted]:text-red-300 data-[highlighted]:bg-red-900 cursor-pointer transition-colors duration-200"
            >
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
