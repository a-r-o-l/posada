import { Schema, Document, model, models } from "mongoose";
import { ISchoolPopulated } from "./School";

export interface IFolder extends Document {
  _id: string;
  type: "child" | "parent";
  title: string;
  description?: string;
  schoolId?: string;
  password?: string;
  isPrivate?: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PartialFolder = Partial<IFolder>;
export type PartialFolderPopulated = Omit<IFolder, "schoolId"> & {
  schoolId: ISchoolPopulated;
};

const FolderSchema: Schema = new Schema(
  {
    type: { type: String, default: "parent" },
    title: { type: String, required: true },
    description: { type: String },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    password: { type: String },
    isPrivate: { type: Boolean, default: false },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FolderModel = models.Folder || model<IFolder>("Folder", FolderSchema);
export default FolderModel;
