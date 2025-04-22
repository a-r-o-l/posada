"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { PartialChildren } from "@/models/Account";
import { revalidatePath } from "next/cache";

export const createAccount = async (data: FormData, admin: boolean = false) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const accountExists = await models.Account.findOne({
      email: formData.email,
    }).lean();
    if (accountExists) {
      return {
        success: false,
        message: "Ya existe una cuenta registrada con este correo electrónico",
        account: null,
      };
    }
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
    if (admin) {
      revalidatePath("/admin/accounts");
    }
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

export const changeDisabled = async (id: string, value?: boolean) => {
  try {
    await dbConnect();

    // Log antes de la actualización
    console.log("ID de cuenta a actualizar:", id);

    // Intentar con updateOne primero
    const result = await models.Account.updateOne(
      { _id: id },
      { disabled: value }
    );

    console.log("Resultado de updateOne:", result);

    // Verificar si se actualizó
    const updatedAccount = await models.Account.findById(id).lean();

    if (!updatedAccount) {
      console.error("No se pudo encontrar la cuenta después de actualizar");
      return {
        success: false,
        message: "Error al actualizar la cuenta",
        account: null,
      };
    }

    console.log("Estado de la cuenta después de actualizar:", updatedAccount);

    revalidatePath("/admin/accounts");
    return {
      success: true,
      message: "Cuenta actualizada correctamente.",
      account: JSON.parse(JSON.stringify(updatedAccount)),
    };
  } catch (error) {
    console.error("Error completo:", error);
    return {
      success: false,
      message: "Error al actualizar la cuenta, intente nuevamente.",
      account: null,
    };
  }
};

export const getAllAccounts = async () => {
  try {
    await dbConnect();
    const accounts = await models.Account.find()
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

export const updateChildren = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    if (formData.children) {
      formData.children = JSON.parse(formData.children as string);
    }
    const children = formData.children;
    if (children && Array.isArray(children)) {
      for (const child of children) {
        const normalizeText = (text: string) => {
          return text
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        };

        const normalizedName = normalizeText(child.name);
        const normalizedLastname = normalizeText(child.lastname);
        const query = {
          $or: [
            {
              name: new RegExp(`^${normalizedName}$`, "i"),
              lastname: new RegExp(`^${normalizedLastname}$`, "i"),
            },
            {
              name: child.name,
              lastname: child.lastname,
            },
          ],
        };

        const existingChild = await models.Student.findOne(query)
          .collation({
            locale: "es",
            strength: 1,
          })
          .lean();
        if (!existingChild) {
          return {
            success: false,
            message: `${child.name} ${child.lastname} no existe en nuestra base de datos.`,
            account: null,
          };
        } else {
          const parsedChild = JSON.parse(JSON.stringify(existingChild));
          child.studentId = parsedChild._id;
        }
      }
    }
    const availableGrades = Array.isArray(children)
      ? children.map((child: PartialChildren) => child.gradeId)
      : [];
    const updatedAccount = await models.Account.findByIdAndUpdate(id, {
      children: formData.children,
      verified: true,
      availableGrades,
    }).lean();

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
