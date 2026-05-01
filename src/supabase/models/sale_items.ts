import { FileFullDetails } from "./file";
import { ProductFullDetails } from "./product";

export interface SaleItems {
  id: string;
  sale_id: string;
  product_id: string;
  file_id: string;
  quantity: number;
  price: number;
  total: number;
  created_at: number;
}

export interface SaleItemsFullDetails extends SaleItems {
  product?: ProductFullDetails;
  file?: FileFullDetails;
}
