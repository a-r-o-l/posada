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
  grades?: string[];
  parentFolder?: string;
  year?: string;
  createdAt: Date;
  updatedAt: Date;
  level: string;
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
    grades: { type: [Schema.ObjectId], ref: "Grade", default: [] },
    parentFolder: { type: Schema.ObjectId, ref: "Folder" },
    year: { type: String, default: new Date().getFullYear().toString() },
    level: { type: String, default: "jardin" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FolderModel = models.Folder || model<IFolder>("Folder", FolderSchema);
export default FolderModel;
