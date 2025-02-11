"use server";

import { sendEmail } from "@/lib/brevo";

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
