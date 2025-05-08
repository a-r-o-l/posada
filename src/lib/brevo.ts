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

interface ContactFormParams {
  username: string;
  senderEmail: string;
  title: string;
  content: string;
}

export async function sendEmail({ subject, to, htmlContent }: params) {
  smtpEmail.subject = subject;
  smtpEmail.to = to;
  smtpEmail.htmlContent = htmlContent;
  smtpEmail.sender = { name: "POSADA", email: "contacto@fotosposada.com.ar" };

  await apiInstance.sendTransacEmail(smtpEmail);
}

export async function sendEmailFromUser({
  username,
  senderEmail,
  title,
  content,
}: ContactFormParams) {
  smtpEmail.subject = title;
  smtpEmail.to = [
    {
      email: "contacto@fotosposada.com.ar",
      name: "Contacto Posada",
    },
  ];
  smtpEmail.htmlContent = content;
  smtpEmail.sender = {
    name: username,
    email: senderEmail,
  };

  await apiInstance.sendTransacEmail(smtpEmail);
}
