"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/zustand/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null; // Este componente no renderiza nada
}
