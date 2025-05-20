"use server";
import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";

export const getAllGrades = async () => {
  try {
    await dbConnect();
    const grades = await models.Grade.find().lean();
    return {
      success: true,
      message: "Cursos encontrados",
      grades: JSON.parse(JSON.stringify(grades)),
    };
  } catch (error) {
    console.error("Error buscando cursos:", error);

    return {
      success: false,
      message: "Error al buscar los cursos",
    };
  }
};

export const getAllGradesBySchool = async (schoolId?: string) => {
  if (!schoolId)
    return {
      success: false,
      message: "Falta el id de la escuela",
      grades: [],
    };
  try {
    await dbConnect();
    const grades = await models.Grade.find({ schoolId }).lean();
    return {
      success: true,
      message: "Cursos encontrados",
      grades: JSON.parse(JSON.stringify(grades)),
    };
  } catch (error) {
    console.error("Error buscando cursos:", error);

    return {
      success: false,
      message: "Error al buscar los cursos",
    };
  }
};

export const getAllGradesBySchoolAndYear = async (
  schoolId?: string,
  year?: string
) => {
  if (!schoolId)
    return {
      success: false,
      message: "Falta el id de la escuela",
      grades: [],
    };
  if (!year)
    return {
      success: false,
      message: "Falta el año",
      grades: [],
    };
  try {
    await dbConnect();
    const grades = await models.Grade.find({ schoolId, year }).lean();
    return {
      success: true,
      message: "Cursos encontrados",
      grades: JSON.parse(JSON.stringify(grades)),
    };
  } catch (error) {
    console.error("Error buscando cursos:", error);

    return {
      success: false,
      message: "Error al buscar los cursos",
    };
  }
};

export const getGrade = async (id: string) => {
  try {
    await dbConnect();
    const grade = await models.Grade.findById(id).lean();
    return {
      success: true,
      message: "Curso encontrado",
      grade: JSON.parse(JSON.stringify(grade)),
    };
  } catch (error) {
    console.error("Error buscando curso:", error);

    return {
      success: false,
      message: "Error al buscar el curso",
    };
  }
};

export const createGrade = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    const newGrade = new models.Grade({
      grade: String(formData.grade).toLowerCase(),
      division: formData.division,
      displayName: String(formData.displayName).toLowerCase(),
      year: formData.year,
      schoolId: formData.schoolId,
    });
    await newGrade.save();
    revalidatePath(`/schools/students?school=${newGrade.schoolId}`);
    return {
      success: true,
      message: "Curso creado",
      grade: JSON.parse(JSON.stringify(newGrade)),
    };
  } catch (error) {
    console.error("Error creando curso:", error);
    return {
      success: false,
      message: "Error al crear el curso",
    };
  }
};

export const updateGrade = async (data: FormData, id: string) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    const updatedGrade = await models.Grade.findByIdAndUpdate(
      id,
      {
        grade: String(formData.grade).toLowerCase(),
        division: String(formData.division).toLowerCase(),
        displayName: String(formData.displayName).toLowerCase(),
        year: formData.year,
      },
      { new: true }
    );

    if (!updatedGrade) {
      return {
        success: false,
        message: "Curso no encontrado",
      };
    }

    revalidatePath(`/schools/${updatedGrade.schoolId}`);
    return {
      success: true,
      message: "Curso actualizado",
      grade: JSON.parse(JSON.stringify(updatedGrade)),
    };
  } catch (error) {
    console.error("Error actualizando curso:", error);
    return {
      success: false,
      message: "Error al actualizar el curso",
    };
  }
};

export const deleteGrade = async (id: string) => {
  try {
    await dbConnect();

    const deletedStudents = await models.Student.deleteMany({ gradeId: id });
    console.log(`Deleted ${deletedStudents.deletedCount} students from grade`);

    const grade = await models.Grade.findByIdAndDelete(id);

    if (!grade) {
      return {
        success: false,
        message: "Curso no encontrado",
      };
    }

    revalidatePath(`/admin/schools`);
    return {
      success: true,
      message: `Curso eliminado y ${deletedStudents.deletedCount} estudiantes removidos`,
      grade: JSON.parse(JSON.stringify(grade)),
    };
  } catch (error) {
    console.error("Error eliminando curso:", error);
    return {
      success: false,
      message: "Error al eliminar el curso y sus estudiantes",
    };
  }
};
