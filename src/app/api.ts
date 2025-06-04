import { ISale } from "@/models/Sale";
import { createSale, getSale, updateSale } from "@/server/saleAction";
import { MercadoPagoConfig, Preference } from "mercadopago";

interface IProd {
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

export const mercadopago = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_ACCESS_TOKEN,
});

const api = {
  product: {
    async update(
      formdata: FormData
    ): Promise<{ success: boolean; message: string; sale: ISale }> {
      const saleId = formdata.get("saleId") as string;
      const res = await updateSale(saleId, formdata);
      return res;
    },
    async submit(prods: IProd[], accountId: string, total: string) {
      const formData = new FormData();
      formData.append("products", JSON.stringify(prods));
      formData.append("accountId", accountId);
      formData.append("total", total);

      const res = await createSale(formData);
      if (res.success) {
        const parsedProds = prods.map((prod) => ({
          id: prod.id.toString(),
          unit_price: 100,
          title: prod.name,
          quantity: prod.quantity,
        }));
        const preference = await new Preference(mercadopago).create({
          body: {
            items: parsedProds,
            metadata: {
              products: prods,
              sale: res.sale,
            },
            back_urls: {
              success:
                "http://localhost:3000/store/cart/checkout?status=success",
              failure:
                "http://localhost:3000/store/cart/checkout?status=failure",
              pending:
                "http://localhost:3000/store/cart/checkout?status=pending",
            },
            auto_return: "approved",
          },
        });
        const updateFormData = new FormData();
        if (preference.id) {
          updateFormData.append("preferenceId", preference.id);
        }
        await updateSale(res.sale._id, updateFormData);
        return {
          success: true,
          message: res.message,
          url: preference.init_point!,
        };
      } else {
        return {
          success: false,
          message: res.message,
          url: "",
        };
      }
    },
    async getPaymentLink(saleId: string) {
      try {
        const sale = await getSale(saleId); // Función para obtener la venta por ID
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

        const preference = await response.json();
        if (!preference.init_point) {
          throw new Error("No se pudo obtener el enlace de pago.");
        }

        return preference.init_point;
      } catch (error) {
        console.error("Error al obtener el enlace de pago:", error);
        throw new Error("Error al obtener el enlace de pago.");
      }
    },
    // {
    //   const sale = await getSale(saleId);
    //   if (!sale) {
    //     throw new Error("Venta no encontrada.");
    //   }
    //   const { sale: foundSale } = sale;
    //   const preference = await new Preference(mercadopago).get(
    //     foundSale.preferenceId
    //   );
    //   return preference.init_point;
    // },
  },
};

export default api;
