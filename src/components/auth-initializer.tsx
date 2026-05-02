"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/zustand/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    console.log("se ejecuta el initializeAuth");
    initializeAuth();
  }, [initializeAuth]);

  return null; // Este componente no renderiza nada
}
