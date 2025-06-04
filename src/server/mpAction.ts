"use server";

import fetch from "node-fetch";
import { createSale, getSale, updateSale } from "./saleAction";
import { IMPPreference } from "@/types/mercadopago";
import { ISaleProduct } from "@/models/Sale";

const MERCADOPAGO_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN as string;
const MERCADOPAGO_SUCCESS = process.env.MP_SUCCESS as string;
const MERCADOPAGO_FAILURE = process.env.MP_FAILURE as string;
const MERCADOPAGO_PENDING = process.env.MP_PENDING as string;

export const createPayment = async (data: FormData) => {
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("El token de acceso de MercadoPago no está configurado.");
  }
  try {
    const res = await createSale(data);
    if (res.success) {
      const prods = JSON.parse(data.get("products") as string);
      const parsedProds = prods.map((prod: ISaleProduct) => ({
        id: prod.id.toString(),
        unit_price: prod.price,
        title: prod.name,
        quantity: prod.quantity,
      }));
      const preference = {
        items: parsedProds,
        metadata: {
          sale: res.sale._id.toString(),
        },
        back_urls: {
          success: MERCADOPAGO_SUCCESS,
          failure: MERCADOPAGO_FAILURE,
          pending: MERCADOPAGO_PENDING,
        },
        auto_return: "approved",
      };

      const response = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preference),
        }
      );

      console.log("Response:", response);
      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

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
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("El token de acceso de MercadoPago no está configurado.");
  }
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
