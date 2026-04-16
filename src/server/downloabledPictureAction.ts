"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";

export const getDPByAccountId = async (accountId: string) => {
  try {
    await dbConnect();
    const archivos = await models.DownloabledPicture.find({ accountId }).sort({
      createdAt: -1,
    });
    return {
      success: true,
      message: "Archivos obtenidos correctamente.",
      data: JSON.parse(JSON.stringify(archivos)),
    };
  } catch (error) {
    console.error("Error obteniendo los archivos:", error);
    return {
      success: false,
      message: "Error al obtener los archivos, intente nuevamente.",
      data: null,
    };
  }
};

export const createDP = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    const newDP = new models.DownloabledPicture({
      fileName: formData.fileName,
      url: formData.url,
      accountId: formData.accountId,
      fileId: formData.fileId,
    });

    await newDP.save();

    return {
      success: true,
      message: "Archivo creado correctamente.",
      data: JSON.parse(JSON.stringify(newDP)),
    };
  } catch (error) {
    console.error("Error creando el archivo:", error);
    return {
      success: false,
      message: "Error al crear el archivo, intente nuevamente.",
      data: null,
    };
  }
};
