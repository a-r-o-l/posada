import { Payment } from "mercadopago";
import { mercadopago } from "@/app/api";
import { getSale, updateSale } from "@/server/saleAction";
import { sendEmail } from "@/lib/brevo";
import { tahnksEmailTemplate } from "@/templates/thanksEmail";

export async function POST(request: Request) {
  try {
    const body: { data: { id: string } } = await request.json();
    const payment = await new Payment(mercadopago).get({ id: body.data.id });

    // Obtener el ID de la venta desde la metadata
    // Ahora es un string, no un objeto completo
    const saleId = payment.metadata.sale;

    // Obtener la venta completa de la base de datos
    const { sale: foundSale } = await getSale(saleId);

    if (!foundSale) {
      console.error("Venta no encontrada:", saleId);
      return new Response(null, { status: 404 });
    }

    const formData = new FormData();
    formData.append("statusDetail", payment.status_detail || "");
    formData.append("transactionId", payment.id?.toString() || "");
    formData.append("dateApproved", payment?.date_approved || "");
    formData.append("dateCreated", payment?.date_created || "");
    formData.append("paymentMethodId", payment.payment_method_id || "");
    formData.append("paymentTypeId", payment.payment_type_id || "");
    formData.append("collector_id", payment.collector_id?.toString() || "");

    if (payment.payer) {
      formData.append("payer", JSON.stringify(payment.payer));
    }

    if (payment.status === "approved") {
      formData.append("status", "approved");
      const res = await updateSale(saleId, formData);

      // Si la actualización fue exitosa, enviar email
      if (res.success) {
        await sendEmail({
          subject: "Compra Exitosa",
          to: [
            {
              name: foundSale.accountId.name,
              email: foundSale.accountId.email,
            },
          ],
          htmlContent: tahnksEmailTemplate(foundSale),
        });

        return new Response(null, { status: 200 });
      } else {
        console.error("Error actualizando venta:", res.message);
        return new Response(null, { status: 500 });
      }
    } else {
      // Si el pago no es approved, actualizar con el estado que tenga
      formData.append("status", payment.status || "");
      const res = await updateSale(saleId, formData);

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
