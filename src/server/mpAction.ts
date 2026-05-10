"use server";

import fetch from "node-fetch";
import { headers } from "next/headers";
// import { createSale, getSale, updateSale } from "./saleAction";
import { updateSale, createSale, getSale } from "@/supabase/hooks/server/sales";
import { IMPPreference } from "@/types/mercadopago";

interface ISaleProduct {
  id: string;
  fileId: string;
  productId: string;
  fileTitle: string;
  fileImageUrl: string;
  quantity: number;
  name: string;
  price: number;
  total: number;
}

const MERCADOPAGO_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN as string;

const getBaseUrl = async () => {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const referer = headerStore.get("referer");
  if (referer) {
    return new URL(referer).origin;
  }

  const forwardedHost = headerStore.get("x-forwarded-host");
  if (forwardedHost) {
    const protocol = headerStore.get("x-forwarded-proto") ?? "https";
    return `${protocol}://${forwardedHost}`;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
};

const getBackUrls = async () => {
  const baseUrl = await getBaseUrl();
  const checkoutUrl = new URL("/checkout", baseUrl);

  return {
    success: `${checkoutUrl.toString()}?status=success`,
    failure: `${checkoutUrl.toString()}?status=failure`,
    pending: `${checkoutUrl.toString()}?status=pending`,
  };
};

export const createPayment = async (data: FormData) => {
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("El token de acceso de MercadoPago no está configurado.");
  }
  try {
    const backUrls = await getBackUrls();
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
        external_reference: res.sale.order,
        metadata: {
          sale: res.sale.id.toString(),
        },
        back_urls: backUrls,
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
        },
      );

      console.log("Response:", response);
      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error al obtener la preferencia de Mercado Pago: ${response.status} - ${response.statusText}`,
        );
        console.error(`Respuesta de la API: ${errorText}`);
        throw new Error("Error al obtener la preferencia de Mercado Pago.");
      } else {
        const preferenceResponse = (await response.json()) as IMPPreference;
        const updateFormData = new FormData();
        updateFormData.append("preference_id", preferenceResponse?.id);
        await updateSale(res.sale.id, updateFormData);
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
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error al obtener la preferencia de Mercado Pago: ${response.status} - ${response.statusText}`,
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
