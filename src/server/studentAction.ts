"use server";
import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { PartialStudent } from "@/models/Student";
import { revalidatePath } from "next/cache";

export const getAllStudents = async () => {
  try {
    await dbConnect();
    const students = await models.Student.find()
      .populate("schoolId")
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
export const getAllStudentsBySchool = async (schoolId: string) => {
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
      name: String(formData.name).toLowerCase(),
      lastname: String(formData.lastname).toLowerCase(),
      displayName: String(formData.displayName).toLowerCase(),
      gradeId: formData.gradeId,
      schoolId: formData.schoolId,
    });
    revalidatePath(
      `/schools/students?school=${formData.schoolId}&grade=${formData.gradeId}`
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

export const createManyStudents = async (students: PartialStudent[]) => {
  try {
    await dbConnect();
    await models.Student.insertMany(students);
    revalidatePath(
      `/admin/schools?school=${students[0].schoolId}&grade=${students[0].gradeId}`
    );
    return {
      success: true,
      message: "Estudiantes creados",
    };
  } catch (error) {
    console.error("Error creando estudiantes:", error);
    return {
      success: false,
      message: "Error al crear los estudiantes",
    };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    await dbConnect();
    await models.Student.findByIdAndDelete(id);
    revalidatePath(`/admin/schools`);
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

export const updateStudent = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    const sanitizedData = {
      name: String(formData.name).toLowerCase(),
      lastname: String(formData.lastname).toLowerCase(),
      displayName: String(formData.displayName).toLowerCase(),
    };

    const student = await models.Student.findByIdAndUpdate(id, sanitizedData, {
      new: true,
    });

    revalidatePath(`/admin/schools/${student?.schoolId}`);
    return {
      success: true,
      message: "Estudiante actualizado",
      student: JSON.parse(JSON.stringify(student)),
    };
  } catch (error) {
    console.error("Error actualizando estudiante:", error);
    return {
      success: false,
      message: "Error al actualizar el estudiante",
    };
  }
};
