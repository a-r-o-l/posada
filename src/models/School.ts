import { Schema, Document, model, models } from "mongoose";
import { IFolder } from "./Folder";

export interface ISchool extends Document {
  _id: string;
  name: string;
  description: string;
  password?: string;
  isPrivate?: boolean;
  imageUrl?: string;
  folders: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type PartialSchool = Partial<ISchool>;

export interface ISchoolPopulated extends Omit<ISchool, "folders"> {
  folders: IFolder[];
}
const SchoolSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    password: { type: String },
    isPrivate: { type: Boolean, default: true },
    imageUrl: { type: String },
    folders: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = models.School || model<ISchool>("School", SchoolSchema);
export default SchoolModel;
