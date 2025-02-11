import { Schema, model, models } from "mongoose";
import { ISchoolPopulated } from "./School";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PartialProduct = Partial<IProduct>;
export type PartialProductPopulated = Omit<IProduct, "schoolId"> & {
  schoolId: ISchoolPopulated;
};

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductModel =
  models.Product || model<IProduct>("Product", ProductSchema);
export default ProductModel;
