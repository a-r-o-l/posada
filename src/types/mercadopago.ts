import { IProduct } from "@/models/Product";
import { ISale } from "@/models/Sale";

export interface IMPPreference {
  id: string;
  init_point?: string;
  items: {
    id: string;
    title: string;
    description?: string;
    picture_url?: string;
    category_id?: string;
    currency_id?: string;
    unit_price: number;
    quantity: number;
  }[];
  metadata?: {
    products: IProduct[];
    sale: ISale;
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  payer?: {
    email?: string;
    name?: string;
    surname?: string;
    phone?: {
      area_code: string;
      number: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    address?: {
      zip_code: string;
      street_name: string;
      street_number: string;
    };
    date_created?: string;
  };
  payment_methods?: {
    excluded_payment_methods: {
      id: string;
    }[];
    excluded_payment_types: {
      id: string;
    }[];
    default_payment_method_id: string;
    installments: number;
    default_installments: number;
  };
  shipments?: {
    mode: string;
    local_pickup: boolean;
    dimensions: string;
    default_shipping_method: number;
    free_methods: { id: string }[];
    receiver_address: {
      zip_code: string;
      street_name: string;
      street_number: string;
      floor: string;
      apartment: string;
      city_name: string;
      state_name: string;
      country_name: string;
    };
    cost: number;
    free_shipping: boolean;
  };
  notification_url?: string;
  statement_descriptor?: string;
  additional_info?: string;
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
  marketplace?: string;
  marketplace_fee?: number;
  differential_pricing?: {
    id: number;
  };
  tracks?: {
    type: string;
    values: {
      conversion_id: number;
      conversion_label: string;
      pixel_id: string;
    };
  }[];
}
