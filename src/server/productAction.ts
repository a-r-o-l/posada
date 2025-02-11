"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";

export const getAllProducts = async () => {
  try {
    await dbConnect();

    const products = await models.Product.find().lean();
    return {
      success: true,
      message: "Productos encontradas",
      products: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Error buscando productos:", error);
    return {
      success: false,
      message: "Error al buscar productos, intente nuevamente.",
    };
  }
};

export const getAllProductsById = async (id: string) => {
  try {
    await dbConnect();
    const products = await models.Product.find({ schoolId: id }).lean();
    return {
      success: true,
      message: "Productos encontradas",
      products: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Error buscando productos:", error);
    return {
      success: false,
      message: "Error al buscar productos, intente nuevamente.",
    };
  }
};

export const createProduct = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());

    const newProduct = new models.Product({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      schoolId: formData.schoolId,
    });
    revalidatePath("/admin/prducts?school=" + formData.schoolId);
    await newProduct.save();
    return {
      success: true,
      message: "Producto creado correctamente.",
      producto: JSON.parse(JSON.stringify(newProduct)),
    };
  } catch (error) {
    console.error("Error creando el producto:", error);
    return {
      success: false,
      message: "Error al crear el producto, intente nuevamente.",
      producto: null,
    };
  }
};

export const updateProduct = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const product = await models.Product.findByIdAndUpdate(id, {
      name: formData.name,
      description: formData.description,
      price: formData.price,
    });
    revalidatePath("/admin/prducts?school=" + id);
    return {
      success: true,
      message: "Producto actualizado correctamente.",
      producto: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.error("Error actualizando el producto:", error);
    return {
      success: false,
      message: "Error al actualizar el producto, intente nuevamente.",
    };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await dbConnect();
    const product = await models.Product.findByIdAndDelete(id);
    revalidatePath("/admin/prducts?school=" + product.schoolId);
    return {
      success: true,
      message: "Producto eliminado correctamente.",
    };
  } catch (error) {
    console.error("Error eliminando el producto:", error);
    return {
      success: false,
      message: "Error al eliminar el producto, intente nuevamente.",
    };
  }
};
