"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";

export const getAllFolders = async (schoolId?: string) => {
  try {
    await dbConnect();
    let matchStage = {};
    if (schoolId) {
      matchStage = { schoolId };
    }
    const folders = await models.Folder.find(matchStage)
      .sort({ title: 1 })
      .lean();

    return {
      success: true,
      message: "Carpetas encontradas",
      folders: JSON.parse(JSON.stringify(folders)),
    };
  } catch (error) {
    console.error("Error buscando las carpetas:", error);
    return {
      success: false,
      message: "Error al buscar las carpetas, intente nuevamente",
    };
  }
};

export const getOneFolder = async (id: string) => {
  try {
    await dbConnect();
    const folder = await models.Folder.findById(id).lean();
    if (!folder) {
      return {
        success: false,
        message: "No se encontró la carpeta",
      };
    }

    const filesData = await models.File.find({
      folderId: id,
    }).lean();

    const folderData = JSON.parse(JSON.stringify(folder));
    const files = JSON.parse(JSON.stringify(filesData));

    return {
      success: true,
      message: "Carpeta encontrada",
      folder: {
        ...folderData,
        files,
      },
    };
  } catch (error) {
    console.error("Error buscando la carpeta:", error);
    return {
      success: false,
      message: "Error al buscar la carpeta, intente nuevamente",
    };
  }
};

export const createFolder = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const existingFolder = await models.Folder.findOne({
      title: formData.title,
      schoolId: formData.schoolId,
    });

    if (existingFolder) {
      return {
        success: false,
        message: "Ya existe una carpeta en este colegio con el mismo nombre.",
      };
    }

    const newFolder = new models.Folder({
      title: formData.title,
      description: formData.description,
      password: formData.password,
      imageUrl: formData.imageUrl,
      schoolId: formData.schoolId,
      isPrivate: !!formData.password,
    });

    await newFolder.save();
    await models.School.findByIdAndUpdate(formData.schoolId, {
      $push: { folders: newFolder._id },
    });
    revalidatePath("/admin/schools");

    return {
      success: true,
      message: "Carpeta creada correctamente",
      product: JSON.parse(JSON.stringify(newFolder)),
    };
  } catch (error) {
    console.error("Error creando la carpeta:", error);
    return {
      success: false,
      message: "Error al crear la carpeta, intente nuevamente",
    };
  }
};

export const deleteFolder = async (id: string) => {
  try {
    await dbConnect();
    const folder = await models.Folder.findById(id);
    if (!folder) {
      return {
        success: false,
        message: "No se encontró la carpeta",
      };
    }
    await models.File.deleteMany({ folderId: id });
    await models.Folder.deleteOne({ _id: id });
    revalidatePath("/admin/folders");
    return {
      success: true,
      message: "Carpeta eliminada correctamente.",
    };
  } catch (error) {
    console.error("Error eliminando la carpeta:", error);
    return {
      success: false,
      message: "Error al eliminar la carpeta, intente nuevamente.",
    };
  }
};
