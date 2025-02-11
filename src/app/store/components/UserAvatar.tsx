"use client";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { ThemeButton } from "@/components/ThemeButton";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOutIcon, Package2, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Child {
  name: string;
  lastname: string;
  grade: string;
}
interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  password: string;
  imageUrl: string;
  children: Child[];
}

function UserAvatar({ user }: { user?: User }) {
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <Avatar className="items-center justify-center border border-white">
        <User className="w-6 h-6" />
      </Avatar>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="flex justify-between items-center">
            <DropdownMenuLabel>
              {user?.name} {user?.lastname}
            </DropdownMenuLabel>
            <ThemeButton />
          </div>
          <div className="px-2">
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center justify-between">
              Cuenta
              <User />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => router.push("/store/purchases")}
            >
              Mis compras
              <Package2 />
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center justify-between text-red-500"
              onClick={() => setOpenAlert(true)}
            >
              Cerrar sesión
              <LogOutIcon />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomAlertDialog
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        title="Cerrar sesión"
        description="¿Estás seguro de cerrar sesión?"
        onAccept={() => {
          signOut({
            callbackUrl: "/signin",
          });
        }}
      />
    </div>
  );
}

export default UserAvatar;
