"use server";

import dbConnect from "@/lib/mongoose";
import { deleteFileFromS3 } from "@/lib/uploadFileToS3";
import models from "@/models";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";

export const getAllFiles = async (id?: string) => {
  try {
    await dbConnect();
    let query = {};
    if (id) {
      query = { folderId: id };
    }
    const files = await models.File.find(query).lean();

    return {
      success: true,
      message: "Archivos encontradas",
      files: JSON.parse(JSON.stringify(files)),
    };
  } catch (error) {
    console.error("Error buscando los archivos:", error);
    return {
      success: false,
      message: "Error al buscar los archivos, intente nuevamente",
    };
  }
};

export const createFile = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const existingFile = await models.Folder.findOne({
      $or: [
        { fileName: formData.fileName },
        { title: formData.title },
        {
          imageUrl: formData.imageUrl,
        },
      ],
    });
    if (existingFile) {
      return {
        success: false,
        message: "Nombre o url ya existente.",
      };
    }
    const newFile = new models.File({
      fileName: formData.fileName,
      title: formData.title,
      description: formData.description,
      folderId: formData.folderId,
      imageUrl: formData.imageUrl,
      price: formData.price,
    });

    await newFile.save();
    return {
      success: true,
      message: "Archivo creado correctamente.",
      archivo: JSON.parse(JSON.stringify(newFile)),
    };
  } catch (error) {
    console.error("Error creando el archivo:", error);
    return {
      success: false,
      message: "Error al crear el archivo, intente nuevamente.",
    };
  }
};

export const createManyFiles = async (
  filesData: Array<{
    fileName: string;
    title: string;
    description: string;
    price: string;
    folderId: string;
    imageUrl: string;
  }>,
  folderId: string
) => {
  try {
    await dbConnect();

    const files = filesData.map((file) => ({
      ...file,
      price: Number(file.price),
    }));

    const newFiles = await models.File.insertMany(files);
    revalidatePath(`/admin/folders/${folderId}`);
    return {
      success: true,
      message: "Archivos creados correctamente.",
      files: JSON.parse(JSON.stringify(newFiles)),
    };
  } catch (error) {
    console.error("Error creando los archivos:", error);
    return {
      success: false,
      message: "Error al crear los archivos, intente nuevamente.",
    };
  }
};

export const deleteFileInParentFolder = async (id: string) => {
  try {
    await dbConnect();
    const file = await models.File.findById(id);
    if (!file) {
      return {
        success: false,
        message: "Archivo no encontrado.",
      };
    }
    const deleteImgFromBucket = await deleteFileFromS3(file.title, "posada");
    if (!deleteImgFromBucket.success) {
      return {
        success: false,
        message: "Error al eliminar la imagen del bucket.",
      };
    }

    await file.deleteOne();
    revalidatePath(`/admin/folders/${file.folderId}`);
    return {
      success: true,
      message: "Archivo eliminado correctamente.",
    };
  } catch (error) {
    console.error("Error eliminando el archivo:", error);
    return {
      success: false,
      message: "Error al eliminar el archivo, intente nuevamente.",
    };
  }
};
