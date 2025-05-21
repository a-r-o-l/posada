"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";
import { toDate } from "date-fns-tz";
import { generateRandomNumber } from "@/lib/utilsFunctions";
export const createSale = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const parsedProducts = JSON.parse(formData.products as string);
    const parsedPayer = formData.payer
      ? JSON.parse(formData.payer as string)
      : null;
    const newSale = new models.Sale({
      accountId: formData.accountId,
      total: formData.total,
      status: formData.status,
      statusDetail: formData.statusDetail,
      delivered: formData.delivered,
      products: parsedProducts,
      transactionId: formData.transactionId,
      dateCreated: formData.dateCreated,
      dateApproved: formData.dateApproved,
      paymentMethodId: formData.paymentMethodId,
      collector_id: formData.collector_id,
      payer: parsedPayer,
      order: generateRandomNumber(12),
    });
    await newSale.save();
    return {
      success: true,
      message: "Venta creada correctamente",
      sale: JSON.parse(JSON.stringify(newSale)),
    };
  } catch (error) {
    console.error("Error creando la venta:", error);
    return {
      success: false,
      message: "Error al crear la venta, intente nuevamente",
      sale: null,
    };
  }
};
export const updateSale = async (id: string, data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    if (formData.payer) {
      formData.payer = JSON.parse(formData.payer as string);
    }
    const updatedSale = await models.Sale.findByIdAndUpdate(id, formData, {
      new: true,
    });
    return {
      success: true,
      message: "Venta actualizada correctamente",
      sale: JSON.parse(JSON.stringify(updatedSale)),
    };
  } catch (error) {
    console.error("Error actualizando la venta:", error);
    return {
      success: false,
      message: "Error al actualizar la venta, intente nuevamente",
      sale: null,
    };
  }
};

export const getAllSales = async (
  start?: string,
  end?: string,
  state?: string,
  delivered?: string
) => {
  try {
    const query: {
      status?: string;
      delivered?: boolean;
      createdAt?: {
        $gte: Date;
        $lte: Date;
      };
    } = {};
    if (start && end) {
      const timeZone = "America/Argentina/Buenos_Aires";
      const startDate = toDate(start, { timeZone });
      const endDate = toDate(end, { timeZone });
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    if (state) {
      query.status = state;
    }
    if (delivered) {
      query.delivered = delivered === "delivered";
    }

    await dbConnect();
    const sales = await models.Sale.find(query)
      .populate("accountId")
      .populate({
        path: "products",
        populate: [
          {
            path: "fileId",
            model: "File",
          },
          {
            path: "productId",
            model: "Product",
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();
    return {
      success: true,
      message: "Ventas encontradas",
      sales: JSON.parse(JSON.stringify(sales)),
    };
  } catch (error) {
    console.error("Error getting sales:", error);
    return {
      success: false,
      message: "Error al obtener las ventas, intente nuevamente",
      sales: null,
    };
  }
};

export const getSale = async (id: string) => {
  try {
    await dbConnect();
    const sale = await models.Sale.findById(id)
      .populate({
        path: "accountId",
        model: "Account",
        populate: {
          path: "children",
          populate: ["gradeId", "schoolId"],
        },
      })
      .populate({
        path: "products",
        populate: [
          {
            path: "fileId",
            model: "File",
            populate: {
              path: "folderId",
              model: "Folder",
              populate: {
                path: "schoolId",
                model: "School",
              },
            },
          },
          {
            path: "productId",
            model: "Product",
          },
        ],
      })
      .lean();

    return {
      success: true,
      message: "Venta encontrada",
      sale: JSON.parse(JSON.stringify(sale)),
    };
  } catch (error) {
    console.error("Error getting sale:", error);
    return {
      success: false,
      message: "Error al obtener la venta, intente nuevamente",
      sale: null,
    };
  }
};

export const getSalesByAccount = async (accountId: string) => {
  try {
    await dbConnect();
    const sales = await models.Sale.find({ accountId }).lean();
    return {
      success: true,
      message: "Ventas encontradas",
      sales: JSON.parse(JSON.stringify(sales)),
    };
  } catch (error) {
    console.error("Error getting sales:", error);
    return {
      success: false,
      message: "Error al obtener las ventas, intente nuevamente",
      sales: null,
    };
  }
};

export const getNewSalesCount = async () => {
  try {
    await dbConnect();
    const newSalesCount = await models.Sale.countDocuments({
      isNewSale: true,
    });
    return newSalesCount;
  } catch (error) {
    console.error("Error getting new sales count:", error);
    return 0;
  }
};

export const updateSaleStatus = async (
  id: string,
  field: string,
  value: string | boolean
) => {
  try {
    const condition: { [key: string]: string | boolean } = {};
    condition[field] = value;
    await dbConnect();
    const updatedSale = await models.Sale.findByIdAndUpdate(id, condition, {
      new: true,
    });
    revalidatePath("/admin/orders");
    return {
      success: true,
      message: "Venta actualizada correctamente",
      sale: JSON.parse(JSON.stringify(updatedSale)),
    };
  } catch (error) {
    console.error("Error actualizando el estado de la venta:", error);
    return {
      success: false,
      message: "Error al actualizarel estado de la venta, intente nuevamente",
      sale: null,
    };
  }
};
