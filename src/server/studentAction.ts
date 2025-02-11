"use server";
import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";

export const getAllStudent = async (schoolId: string) => {
  try {
    let query = {};
    if (schoolId) {
      query = { schoolId };
    }
    await dbConnect();
    const students = await models.Student.find(query).lean();
    return {
      success: true,
      message: "Estudiantes encontrados",
      students: JSON.parse(JSON.stringify(students)),
    };
  } catch (error) {
    console.error("Error buscando estudiantes:", error);

    return {
      success: false,
      message: "Error al buscar los estudiantes",
    };
  }
};

export const getAllStudentByGrade = async (gradeId: string) => {
  try {
    await dbConnect();
    const students = await models.Student.find({ gradeId })
      .populate("gradeId")
      .lean();
    return {
      success: true,
      message: "Estudiantes encontrados",
      students: JSON.parse(JSON.stringify(students)),
    };
  } catch (error) {
    console.error("Error buscando estudiantes:", error);

    return {
      success: false,
      message: "Error al buscar los estudiantes",
    };
  }
};

export const getStudent = async (id: string) => {
  try {
    await dbConnect();
    const student = await models.Student.findById(id).lean();
    return {
      success: true,
      message: "Estudiante encontrado",
      student: JSON.parse(JSON.stringify(student)),
    };
  } catch (error) {
    console.error("Error buscando estudiante:", error);

    return {
      success: false,
      message: "Error al buscar el estudiante",
    };
  }
};

export const createStudent = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    const newStudent = new models.Student({
      name: formData.name,
      lastname: formData.lastname,
      gradeId: formData.gradeId,
      displayName: formData.displayName,
      schoolId: formData.schoolId,
    });
    revalidatePath(
      `/admin/students?school=${formData.schoolId}&grade=${formData.gradeId}`
    );
    await newStudent.save();
    return {
      success: true,
      message: "Estudiante creado",
      student: JSON.parse(JSON.stringify(newStudent)),
    };
  } catch (error) {
    console.error("Error creando estudiante:", error);
    return {
      success: false,
      message: "Error al crear el estudiante",
    };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    await dbConnect();
    await models.Student.findByIdAndDelete(id);
    return {
      success: true,
      message: "Estudiante eliminado",
    };
  } catch (error) {
    console.error("Error eliminando estudiante:", error);
    return {
      success: false,
      message: "Error al eliminar el estudiante",
    };
  }
};
