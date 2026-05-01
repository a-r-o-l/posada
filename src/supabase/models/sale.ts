import { Profile } from "./profile";

export interface SaleProduct {
  id: string;
  fileId: string;
  productId: string;
  fileTitle: string;
  fileImageUrl: string;
  quantity: number;
  name: string;
  price: number;
  total: number;
}

export interface SalePayer {
  email?: string;
  entity_type?: string | null;
  first_name?: string | null;
  id?: string;
  identification?: {
    type?: string;
    number?: string;
  };
  last_name?: string | null;
  operator_id?: string | null;
  phone?: {
    area_code?: string;
    number?: string;
  };
  type?: string | null;
}

export interface Sale {
  id: string;
  mongo_id: string;
  order: string;
  preference_id: string | null;
  account_id: string;
  total: number | null;
  status: string | null;
  status_detail: string | null;
  delivered: boolean | null;
  products: SaleProduct[] | null;
  transaction_id: string | null;
  transfer_proof_url: string | null;
  transfer_status: string | null;
  transfer_note: string | null;
  date_created: string | null;
  date_approved: string | null;
  payment_method_id: string | null;
  payment_type_id: string | null;
  collector_id: string | null;
  payer: SalePayer | null;
  is_new_sale: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SaleFullDetails extends Sale {
  profile?: Profile;
}
