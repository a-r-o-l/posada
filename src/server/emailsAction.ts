"use server";

import { sendEmail, sendEmailFromUser } from "@/lib/brevo";

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
