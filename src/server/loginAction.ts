"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (email: string, password: string) => {
  try {
    const data = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, data: data };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: error.cause?.err?.message };
    }
    return { success: false, message: "Hubo un error" };
  }
};
