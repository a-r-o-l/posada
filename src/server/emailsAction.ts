"use server";

import { sendEmail, sendEmailFromUser } from "@/lib/brevo";
import { ISalePopulated } from "@/models/Sale";
import { sendEmail as sendEmailFromServer } from "@/lib/brevo";
import { tahnksEmailTemplate } from "@/templates/thanksEmail";

export const handleSendEmail = async (formdata: FormData, template: string) => {
  const subject = formdata.get("subject") as string;
  const name = formdata.get("name") as string;
  const email = formdata.get("email") as string;

  await sendEmail({
    subject,
    to: [{ name, email }],
    htmlContent: template,
  });
  return { success: true, message: "Email enviado" };
};

export const handleSendEmailFromUser = async (formdata: FormData) => {
  const username = formdata.get("username") as string;
  const senderEmail = formdata.get("senderEmail") as string;
  const title = formdata.get("title") as string;
  const content = formdata.get("content") as string;

  await sendEmailFromUser({
    username,
    senderEmail,
    title,
    content,
  });
  return { success: true, message: "Email enviado" };
};

export const sendEmailToUserAfterApproveTransfer = async (
  sale: ISalePopulated
) => {
  await sendEmailFromServer({
    subject: "Compra Exitosa",
    to: [
      {
        name: sale.accountId.name,
        email: sale.accountId.email,
      },
    ],
    htmlContent: tahnksEmailTemplate(sale),
  });
  return { success: true, message: "Email enviado" };
};
