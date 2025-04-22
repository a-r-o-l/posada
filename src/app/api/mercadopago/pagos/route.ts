import { Payment } from "mercadopago";
import api, { mercadopago } from "@/app/api";
import { getSale } from "@/server/saleAction";
import { sendEmail } from "@/lib/brevo";
import { tahnksEmailTemplate } from "@/templates/thanksEmail";

export async function POST(request: Request) {
  const body: { data: { id: string } } = await request.json();
  const payment = await new Payment(mercadopago).get({ id: body.data.id });
  const sale = payment.metadata.sale;
  const formData = new FormData();
  formData.append("saleId", sale._id);
  formData.append("statusDetail", payment.status_detail!);
  formData.append("transactionId", payment.id!.toString());
  formData.append("dateApproved", payment?.date_approved || "");
  formData.append("dateCreated", payment?.date_created || "");
  formData.append("paymentMethodId", payment.payment_method_id!);
  formData.append("paymentTypeId", payment.payment_type_id!);
  formData.append("collector_id", payment.collector_id!.toString());
  if (payment.payer) {
    formData.append("payer", JSON.stringify(payment.payer));
  }
  if (payment.status === "approved") {
    formData.append("status", "approved");
    const res = await api.product.update(formData);
    const { sale: foundSale } = await getSale(sale._id);
    await sendEmail({
      subject: "Compra Exitosa",
      to: [
        { name: foundSale.accountId.name, email: foundSale.accountId.email },
      ],
      htmlContent: tahnksEmailTemplate(foundSale),
    });

    if (res.success) {
      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 500 });
    }
  } else {
    formData.append("status", payment.status || "");
    const res = await api.product.update(formData);
    if (res.success) {
      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 500 });
    }
  }
}
