"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { IChildrenPopulated, PartialChildren } from "@/models/Account";
import { revalidatePath } from "next/cache";

export const createAccount = async (data: FormData, admin: boolean = false) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const accountExists = await models.Account.findOne({
      email: String(formData.email).toLowerCase(),
    }).lean();
    if (accountExists) {
      return {
        success: false,
        message: "Ya existe una cuenta registrada con este correo electrónico",
        account: null,
      };
    }
    const newAccount = new models.Account({
      name: String(formData.name).toLowerCase(),
      lastname: String(formData.lastname).toLowerCase(),
      phone: formData.phone,
      email: String(formData.email).toLowerCase(),
      password: formData.password,
      role: formData.role,
      imageUrl: formData.imageUrl,
      schoolId: formData.schoolId,
      verified: formData.role !== "user" ? true : false,
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
    const updatedAccount = await models.Account.findById(id).lean();
    if (!updatedAccount) {
      console.error("No se pudo encontrar la cuenta después de actualizar");
      return {
        success: false,
        message: "Error al actualizar la cuenta",
        account: null,
      };
    }
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

export const searchAccounts = async (search: string = "") => {
  try {
    await dbConnect();

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const accounts = await models.Account.find(query)
      .populate([{ path: "children", populate: ["schoolId", "gradeId"] }])
      .lean();
    return {
      success: true,
      message: "Cuentas encontradas",
      accounts: JSON.parse(JSON.stringify(accounts)),
    };
  } catch (error) {
    console.error("Error searching accounts:", error);
    return {
      success: false,
      message: "Error al buscar las cuentas, intente nuevamente",
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

    const account = await models.Account.findOne({ email })
      .populate({
        path: "children",
        populate: [{ path: "schoolId" }, { path: "gradeId" }],
      })
      .lean();

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
    revalidatePath("/admin/accounts");
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

export const addChildToAccount = async (id: string, studentId: string) => {
  try {
    await dbConnect();
    const currentAccount = await models.Account.findById(id).lean();
    if (!currentAccount) {
      return {
        success: false,
        message: "Cuenta no encontrada",
        account: null,
      };
    }
    const student = await models.Student.findById(studentId);
    if (!student) {
      return {
        success: false,
        message: "Estudiante no encontrado",
        account: null,
      };
    }
    const newChild = {
      name: student.name,
      lastname: student.lastname,
      schoolId: student.schoolId,
      gradeId: student.gradeId,
    };

    const updatedAccount = await models.Account.findByIdAndUpdate(
      id,
      {
        verified: true,
        $addToSet: {
          children: newChild,
          availableGrades: student.gradeId,
        },
      },
      { new: true }
    ).lean();
    const plainUpdatedAccount = JSON.parse(JSON.stringify(updatedAccount));
    revalidatePath("/admin/accounts");
    return {
      success: true,
      message: "Menor agregado correctamente.",
      account: plainUpdatedAccount,
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

export const removeChildFromAccount = async (
  accountId: string,
  childToRemove: IChildrenPopulated
) => {
  try {
    await dbConnect();

    const currentAccount = await models.Account.findById(accountId);
    if (!currentAccount) {
      return {
        success: false,
        message: "Cuenta no encontrada",
        account: null,
      };
    }

    // Actualizar la cuenta - removemos el hijo que coincida con todos los campos
    const updatedAccount = await models.Account.findByIdAndUpdate(
      accountId,
      {
        $pull: {
          children: {
            name: childToRemove.name,
            lastname: childToRemove.lastname,
            schoolId: childToRemove.schoolId,
            gradeId: childToRemove.gradeId,
          },
        },
      },
      { new: true }
    ).lean();

    const plainUpdatedAccount = JSON.parse(JSON.stringify(updatedAccount));
    revalidatePath("/admin/accounts");

    return {
      success: true,
      message: "Menor eliminado correctamente.",
      account: plainUpdatedAccount,
    };
  } catch (error) {
    console.error("Error removing child from account:", error);
    return {
      success: false,
      message: "Error al eliminar el menor de la cuenta, intente nuevamente",
      account: null,
    };
  }
};
