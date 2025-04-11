"use server";
import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export const getAllFolders = async (
  schoolId?: string,
  level?: string,
  year?: string,
  estrict: boolean = false,
  type: string = ""
) => {
  try {
    await dbConnect();
    const matchStage: {
      schoolId?: string;
      type?: string;
      level?: string;
      year?: string;
    } = {};

    if (type !== "") {
      matchStage.type = type;
    }
    if (year !== undefined && year !== "") {
      matchStage.year = year;
    }
    if (level !== undefined && level !== "") {
      matchStage.level = level;
    } else {
      if (estrict) {
        return {
          success: false,
          message: "No se encontró el colegio",
          folders: [],
        };
      }
    }

    if (schoolId) {
      matchStage.schoolId = schoolId;
    } else if (estrict) {
      return {
        success: false,
        message: "No se encontró el colegio",
        folders: [],
      };
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
export const getFoldersByLvlAndYear = async (
  schoolId?: string,
  level?: string,
  year?: string
) => {
  try {
    await dbConnect();
    const matchStage: {
      schoolId?: string;
      type?: string;
      level?: string;
      year?: string;
    } = {};
    if (level) {
      matchStage.level = level;
    }
    if (schoolId) {
      matchStage.schoolId = schoolId;
    }
    if (year) {
      matchStage.year = year;
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

    if (formData.isPrivate === "true") {
      const parsedArr = JSON.parse(formData.grades as string);
      const parsedGrades = parsedArr.map(
        (grade: { _id: string }) => new Types.ObjectId(grade._id)
      );
      formData.grades = parsedGrades;
    }
    const newFolder = new models.Folder({
      title: formData.title,
      description: formData.description,
      password: formData.password,
      imageUrl: formData.imageUrl,
      schoolId: formData.schoolId,
      isPrivate: formData.isPrivate === "true",
      parentFolder: formData.parentFolder,
      year: formData.year,
      type: formData.type,
      grades: formData.grades,
      level: formData.level,
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

export const updateFolder = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    if (formData.isPrivate === "true") {
      const parsedArr = JSON.parse(formData.grades as string);
      const parsedGrades = parsedArr.map(
        (grade: { _id: string }) => new Types.ObjectId(grade._id)
      );
      formData.grades = parsedGrades;
    }
    await models.Folder.findByIdAndUpdate(id, {
      title: formData.title,
      description: formData.description,
      password: formData.password,
      imageUrl: formData.imageUrl,
      isPrivate: formData.isPrivate === "true",
      year: formData.year,
      grades: formData.grades,
      level: formData.level,
    });
    if (formData.type === "parent") {
      revalidatePath(`/admin/folders?school=${formData.schoolId}`);
    } else {
      revalidatePath(`/admin/folders/${id}`);
    }
    return {
      success: true,
      message: "Carpeta actualizada correctamente",
    };
  } catch (error) {
    console.error("Error actualizando la carpeta:", error);
    return {
      success: false,
      message: "Error al actualizar la carpeta, intente nuevamente",
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

export const getFoldersAndFiles = async (id: string) => {
  try {
    await dbConnect();
    const folders = await models.Folder.find({ parentFolder: id }).lean();
    const files = await models.File.find({ folderId: id }).lean();
    return {
      success: true,
      message: "Carpetas y archivos encontrados",
      data: {
        folders: JSON.parse(JSON.stringify(folders)),

        files: JSON.parse(JSON.stringify(files)),
      },
    };
  } catch (error) {
    console.error("Error buscando carpetas y archivos:", error);
    return {
      success: false,
      message: "Error al buscar carpetas y archivos, intente nuevamente",
      data: { folders: [], files: [] },
    };
  }
};
