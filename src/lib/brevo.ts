import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

const getApiInstance = () => {
  const apiKey = process.env.BREVO_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("BREVO_API_KEY no esta configurada en el entorno");
  }

  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

  return apiInstance;
};

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
  const smtpEmail = new SendSmtpEmail();
  smtpEmail.subject = subject;
  smtpEmail.to = to;
  smtpEmail.htmlContent = htmlContent;
  smtpEmail.sender = { name: "POSADA", email: "crisposada22@gmail.com" };
  // "contacto@fotosposada.com.ar"

  await getApiInstance().sendTransacEmail(smtpEmail);
}

export async function sendEmailFromUser({
  username,
  senderEmail,
  title,
  content,
}: ContactFormParams) {
  const smtpEmail = new SendSmtpEmail();
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

  await getApiInstance().sendTransacEmail(smtpEmail);
}
