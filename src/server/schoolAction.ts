"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";

export const getAllSchools = async () => {
  try {
    await dbConnect();
    const schools = await models.School.find().lean();
    return {
      success: true,
      message: "Colegios encontrados",
      schools: JSON.parse(JSON.stringify(schools)),
    };
  } catch (error) {
    console.error("Error buscando colegios:", error);
    return {
      success: false,
      message: "Error al buscar colegios, intente nuevamente",
      schools: [],
    };
  }
};

export const getSchool = async (id: string) => {
  try {
    await dbConnect();
    const school = await models.School.findById(id).populate("folders").exec();
    return {
      success: true,
      message: "Colegio encontrado",
      school: JSON.parse(JSON.stringify(school)),
    };
  } catch (error) {
    console.error("Error buscando colegio:", error);
    return {
      success: false,
      message: "Error al buscar colegio, intente nuevamente",
      school: null,
    };
  }
};

export const createSchool = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const newSchool = new models.School({
      name: String(formData.name).toLowerCase(),
      description: String(formData.description).toLowerCase(),
      password: String(formData.password).toLowerCase(),
      imageUrl: formData.imageUrl,
      isPrivate: !!formData.password,
    });
    await newSchool.save();
    revalidatePath("/admin/schools");
    return {
      success: true,
      message: "Colegio creado correctamente",
      product: JSON.parse(JSON.stringify(newSchool)),
    };
  } catch (error) {
    console.error("Error creando el colegio:", error);
    return {
      success: false,
      message: "Error al crear el colegio, intente nuevamente",
    };
  }
};

export const deleteSchool = async (id: string) => {
  try {
    await dbConnect();
    const school = await models.School.findById(id);
    if (!school) {
      return {
        success: false,
        message: "No se encontró el colegio",
      };
    }
    await school.delete();
    revalidatePath("/admin/schools");
    return {
      success: true,
      message: "Colegio eliminado correctamente.",
    };
  } catch (error) {
    console.error("Error eliminando el colegio:", error);
    return {
      success: false,
      message: "Error al eliminar el colegio, intente nuevamente.",
    };
  }
};

export const updateSchool = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const updatedSchool = await models.School.findByIdAndUpdate(
      id,
      {
        name: String(formData.name).toLowerCase(),
        description: String(formData.description).toLowerCase(),
        password: String(formData.password).toLowerCase(),
        imageUrl: formData.imageUrl,
        isPrivate: !!formData.password,
      },
      { new: true }
    );
    revalidatePath("/admin/schools");
    return {
      success: true,
      message: "Colegio actualizado correctamente",
      product: JSON.parse(JSON.stringify(updatedSchool)),
    };
  } catch (error) {
    console.error("Error actualizando el colegio:", error);
    return {
      success: false,
      message: "Error al actualizar el colegio, intente nuevamente",
    };
  }
};
