import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

const smtpEmail = new SendSmtpEmail();

interface params {
  subject: string;
  to: { name: string; email: string }[];
  htmlContent: string;
}

export async function sendEmail({ subject, to, htmlContent }: params) {
  smtpEmail.subject = subject;
  smtpEmail.to = to;
  smtpEmail.htmlContent = htmlContent;
  smtpEmail.sender = { name: "POSADA", email: "contacto@fotosposada.com" };

  await apiInstance.sendTransacEmail(smtpEmail);
}
