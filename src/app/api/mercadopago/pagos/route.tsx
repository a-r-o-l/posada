import { Payment } from "mercadopago";
import { mercadopago } from "@/app/api";
// import { getSale, updateSale } from "@/server/saleAction";
import { getSale, updateSale } from "@/supabase/hooks/server/sales";
import { sendEmail } from "@/lib/brevo";
import { newTahnksEmailTemplate } from "@/templates/thanksEmail";
import { getSaleItemsBySaleId } from "@/supabase/hooks/server/sale_items";

export async function POST(request: Request) {
  try {
    const body: { data: { id: string } } = await request.json();
    const payment = await new Payment(mercadopago).get({ id: body.data.id });

    // Obtener el ID de la venta desde la metadata
    // Ahora es un string, no un objeto completo
    const saleId = payment.metadata.sale;

    // Obtener la venta completa de la base de datos
    const { sale: foundSale } = await getSale(saleId, true);
    const { data } = await getSaleItemsBySaleId(saleId, true);

    if (!foundSale) {
      console.error("Venta no encontrada:", saleId);
      return new Response(null, { status: 404 });
    }

    if (!data) {
      console.error("Items de venta no encontrados para la venta:", saleId);
      return new Response(null, { status: 404 });
    }

    const formData = new FormData();
    formData.append("status_detail", payment.status_detail || "");
    formData.append("transaction_id", payment.id?.toString() || "");
    formData.append("date_approved", payment?.date_approved || "");
    formData.append("date_created", payment?.date_created || "");
    formData.append("payment_method_id", payment.payment_method_id || "");
    formData.append("payment_type_id", payment.payment_type_id || "");
    formData.append("collector_id", payment.collector_id?.toString() || "");

    if (payment.payer) {
      formData.append("payer", JSON.stringify(payment.payer));
    }

    if (payment.status === "approved") {
      formData.append("status", "approved");
      const res = await updateSale(saleId, formData, true);

      // Si la actualización fue exitosa, enviar email
      if (res.success) {
        await sendEmail({
          subject: "Compra Exitosa",
          to: [
            {
              name: foundSale?.profile?.name,
              email: foundSale?.profile?.email,
            },
          ],
          htmlContent: newTahnksEmailTemplate(foundSale, data),
        });

        return new Response(null, { status: 200 });
      } else {
        console.error("Error actualizando venta:", res.message);
        return new Response(null, { status: 500 });
      }
    } else {
      // Si el pago no es approved, actualizar con el estado que tenga
      formData.append("status", payment.status || "");
      const res = await updateSale(saleId, formData, true);

      if (res.success) {
        return new Response(null, { status: 200 });
      } else {
        return new Response(null, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error procesando webhook de MercadoPago:", error);
    return new Response(null, { status: 500 });
  }
}
