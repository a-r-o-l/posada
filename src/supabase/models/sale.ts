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
  order: string;
  preferenceId: string | null;
  accountId: string;
  total: number | null;
  status: string | null;
  statusDetail: string | null;
  delivered: boolean | null;
  products: SaleProduct[] | null;
  transactionId: string | null;
  transferProofUrl: string | null;
  transferStatus: string | null;
  transferNote: string | null;
  dateCreated: string | null;
  dateApproved: string | null;
  paymentMethodId: string | null;
  paymentTypeId: string | null;
  collector_id: string | null;
  payer: SalePayer | null;
  isNewSale: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}
