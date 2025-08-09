import { Schema, Document, model, models } from "mongoose";
import { IAccountPopulated } from "./Account";
import { PartialProductPopulated } from "./Product";
import { PartialFilePopulated } from "./File";

export interface ISale extends Document {
  _id: string;
  order: string;
  preferenceId?: string;
  accountId: string;
  total: number;
  status: string;
  statusDetail?: string;
  delivered: boolean;
  products: ISaleProduct[];
  transactionId?: string;
  // Campos para transferencias
  transferProofUrl?: string;
  transferStatus?: "pending" | "uploaded" | "approved" | "rejected";
  transferNote?: string;
  dateCreated?: Date;
  dateApproved?: Date;
  paymentMethodId?: string;
  paymentTypeId?: string;
  collector_id?: string;
  payer?: {
    email?: string;
    entity_type?: string;
    first_name?: string;
    id?: string;
    identification?: {
      type?: string;
      number?: string;
    };
    last_name?: string;
    operator_id?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
    type?: string;
  };
  isNewSale: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISaleProduct {
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

export type PartialSale = Partial<ISale>;
export type PartialSaleProduct = Partial<ISaleProduct>;

export type ISaleProductPopulated = Omit<
  ISaleProduct,
  "productId" | "fileId"
> & { productId: PartialProductPopulated; fileId: PartialFilePopulated };

export type ISalePopulated = Omit<ISale, "accountId" | "products"> & {
  accountId: IAccountPopulated;
  products: ISaleProductPopulated[];
};
const SaleProductSchema: Schema = new Schema(
  {
    id: { type: String },
    fileId: { type: Schema.ObjectId, ref: "File" },
    productId: { type: Schema.ObjectId, ref: "Product" },
    fileTitle: { type: String },
    fileImageUrl: { type: String },
    quantity: { type: Number },
    name: { type: String },
    price: { type: Number },
    total: { type: Number },
  },
  {
    _id: false,
    timestamps: false,
    versionKey: false,
  }
);

const SaleSchema: Schema = new Schema(
  {
    order: { type: String, requiered: true },
    preferenceId: { type: String },
    accountId: { type: Schema.ObjectId, ref: "Account" },
    total: { type: Number, default: 0 },
    status: { type: String, default: "pending" },
    statusDetail: { type: String },
    delivered: { type: Boolean, default: false },
    products: { type: [SaleProductSchema], default: [] },
    transactionId: { type: String },
    // Campos para transferencias
    transferProofUrl: { type: String },
    transferStatus: {
      type: String,
      enum: ["pending", "uploaded", "approved", "rejected"],
    },
    transferNote: { type: String },
    dateCreated: { type: Date },
    dateApproved: { type: Date },
    paymentMethodId: { type: String },
    paymentTypeId: { type: String },
    collector_id: { type: String },
    isNewSale: { type: Boolean, default: true },
    payer: {
      email: { type: String },
      entity_type: { type: String },
      first_name: { type: String },
      id: { type: String },
      identification: {
        type: { type: String },
        number: { type: String },
      },
      last_name: { type: String },
      operator_id: { type: String },
      phone: {
        area_code: { type: String },
        number: { type: String },
      },
      type: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SaleModel = models.Sale || model<ISale>("Sale", SaleSchema);
export default SaleModel;
