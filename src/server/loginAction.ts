"use server";

import { signIn } from "@/auth";
import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { IAccount } from "@/models/Account";
import { AuthError } from "next-auth";

export const login = async (email: string, password: string) => {
  try {
    await dbConnect();
    const account = (await models.Account.findOne({
      email,
    }).lean()) as IAccount | null;

    if (!account) {
      return {
        success: false,
        message: "Cuenta no encontrada",
      };
    }

    if (account?.disabled === true) {
      return {
        success: false,
        message:
          "Esta cuenta está deshabilitada. Por favor contacte al administrador.",
      };
    }
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
