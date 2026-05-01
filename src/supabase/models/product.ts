import { School } from "./school";

export interface Product {
  id: string;
  mongo_id: string;
  name: string;
  description: string | null;
  price: number;
  school_id: string;
  is_downloadable: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductFullDetails extends Product {
  school?: School;
}
