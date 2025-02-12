"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";

export const createAccount = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const newAccount = new models.Account({
      name: formData.name,
      lastname: formData.lastname,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      imageUrl: formData.imageUrl,
    });
    await newAccount.save();
    return {
      success: true,
      message: "Cuenta creada correctamente",
      account: JSON.parse(JSON.stringify(newAccount)),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: "Error al crear el producto, intente nuevamente",
      account: null,
    };
  }
};

export const getAllAccounts = async () => {
  try {
    await dbConnect();
    const accounts = await models.Account.find({ role: "user" })
      .populate([{ path: "children", populate: ["schoolId", "gradeId"] }])
      .lean();
    return {
      success: true,
      message: "Cuentas encontradas",
      accounts: JSON.parse(JSON.stringify(accounts)),
    };
  } catch (error) {
    console.error("Error getting accounts:", error);
    return {
      success: false,
      message: "Error al obtener las cuentas, intente nuevamente",
      accounts: null,
    };
  }
};

export const getAccount = async (id: string, parsed: boolean = false) => {
  try {
    await dbConnect();
    const account = await models.Account.findById(id).lean();
    return {
      success: true,
      message: "Cuenta encontrada",
      account: parsed ? JSON.parse(JSON.stringify(account)) : account,
    };
  } catch (error) {
    console.error("Error getting account:", error);
    return {
      success: false,
      message: "Error al obtener la cuenta, intente nuevamente",
      account: null,
    };
  }
};

export const getAccountByEmail = async (email: string) => {
  try {
    if (!email) {
      return {
        success: false,
        message: "Error al obtener la cuenta, intente nuevamente",
        account: null,
      };
    }
    await dbConnect();
    const account = await models.Account.findOne({ email }).lean();
    const plainAccount = JSON.parse(JSON.stringify(account));
    return {
      success: true,
      message: "Cuenta encontrada",
      account: plainAccount,
    };
  } catch (error) {
    console.error("Error getting account:", error);
    return {
      success: false,
      message: "Error al obtener la cuenta, intente nuevamente",
      account: null,
    };
  }
};

export const updateAccount = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    if (formData.children) {
      formData.children = JSON.parse(formData.children as string);
    }

    const updatedAccount = await models.Account.findByIdAndUpdate(
      id,
      formData,
      { new: true }
    ).lean();

    const plainUpdatedAccount = JSON.parse(JSON.stringify(updatedAccount));

    return {
      success: true,
      message: "Cuenta actualizada correctamente.",
      account: plainUpdatedAccount,
    };
  } catch (error) {
    console.error("Error updating account:", error);
    return {
      success: false,
      message: "Error al actualizar la cuenta, intente nuevamente.",
      account: null,
    };
  }
};
