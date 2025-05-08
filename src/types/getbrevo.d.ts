declare module "@getbrevo/brevo" {
  export class ApiClient {
    constructor(
      basePath?: string,
      username?: string,
      password?: string,
      apiKey?: string | null
    );
    defaultHeaders: any;
  }

  export interface SendSmtpEmailTo {
    name: string;
    email: string;
  }

  export interface SendSmtpEmailSender {
    name: string;
    email: string;
  }

  export class TransactionalEmailsApi {
    constructor(apiClient?: ApiClient);
    apiClient: ApiClient;
    setApiKey(key: string, value: string): void;
    sendTransacEmail(data: SendSmtpEmail): Promise<{
      response: Response;
      body: { messageId: string };
    }>;
  }

  export class SendSmtpEmail {
    subject?: string;
    sender?: SendSmtpEmailSender;
    to?: SendSmtpEmailTo[];
    htmlContent?: string;
  }

  export enum TransactionalEmailsApiApiKeys {
    apiKey = "api-key",
  }
}
