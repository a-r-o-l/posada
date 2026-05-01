import { File } from "./file";
import { Sale } from "./sale";

export interface DigitalDownload {
  id: string;
  file_name: string;
  url: string;
  account_id: string;
  file_id: string;
  sale_id: string;
  status: string;
}

export interface DigitalDownloadFullDetails extends DigitalDownload {
  sale?: Sale;
  file?: File;
}
