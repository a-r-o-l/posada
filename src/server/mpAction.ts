"use server";

import fetch from "node-fetch";
import { createSale, getSale, updateSale } from "./saleAction";
import { IMPPreference } from "@/types/mercadopago";
import { ISaleProduct } from "@/models/Sale";

const MERCADOPAGO_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN as string;

export const createPayment = async (data: FormData) => {
  try {
    const res = await createSale(data);
    if (res.success) {
      const prods = JSON.parse(data.get("products") as string);
      const parsedProds = prods.map((prod: ISaleProduct) => ({
        id: prod.id.toString(),
        unit_price: 100,
        title: prod.name,
        quantity: prod.quantity,
      }));
      const preference = {
        items: parsedProds,
        metadata: {
          products: prods,
          sale: res.sale,
        },
        back_urls: {
          success: "http://localhost:3000/store/cart/checkout?status=success",
          failure: "http://localhost:3000/store/cart/checkout?status=failure",
          pending: "http://localhost:3000/store/cart/checkout?status=pending",
        },
        auto_return: "approved",
      };

      const response = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          },
          body: JSON.stringify(preference),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error al obtener la preferencia de Mercado Pago: ${response.status} - ${response.statusText}`
        );
        console.error(`Respuesta de la API: ${errorText}`);
        throw new Error("Error al obtener la preferencia de Mercado Pago.");
      } else {
        const preferenceResponse = (await response.json()) as IMPPreference;
        const updateFormData = new FormData();
        updateFormData.append("preferenceId", preferenceResponse?.id);
        await updateSale(res.sale._id, updateFormData);
        return {
          success: true,
          message: res.message,
          url: preferenceResponse.init_point!,
        };
      }
    } else {
      return {
        success: false,
        message: res.message,
        url: "",
      };
    }
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return {
      success: false,
      message: "Error al crear el pago, intente nuevamente",
      url: "",
    };
  }
};

export const getPaymentLink = async (saleId: string) => {
  try {
    const sale = await getSale(saleId);
    if (!sale) {
      throw new Error("Venta no encontrada.");
    }
    const { sale: foundSale } = sale;
    if (!foundSale.preferenceId) {
      throw new Error("ID de preferencia no encontrado en la venta.");
    }

    const response = await fetch(
      `https://api.mercadopago.com/checkout/preferences/${foundSale.preferenceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error al obtener la preferencia de Mercado Pago: ${response.status} - ${response.statusText}`
      );
      console.error(`Respuesta de la API: ${errorText}`);
      throw new Error("Error al obtener la preferencia de Mercado Pago.");
    }

    const preference: IMPPreference = (await response.json()) as IMPPreference;

    if (!preference) {
      throw new Error("No se pudo obtener el enlace de pago.");
    }

    if (!preference.init_point) {
      throw new Error("No se pudo obtener el enlace de pago.");
    }

    return {
      success: true,
      url: preference.init_point,
    };
  } catch (error) {
    console.error("Error al obtener el enlace de pago:", error);
    return {
      success: false,
      message: "Error al obtener el enlace de pago.",
    };
  }
};
