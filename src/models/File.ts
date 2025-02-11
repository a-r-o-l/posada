import { Schema, Document, model, models } from "mongoose";
import { PartialFolderPopulated } from "./Folder";

export interface IFile extends Document {
  _id: string;
  fileName: string;
  title: string;
  description: string;
  folderId?: string;
  imageUrl?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PartialFile = Partial<IFile>;
export type PartialFilePopulated = Omit<IFile, "folderId"> & {
  folderId: PartialFolderPopulated;
};

const FileSchema: Schema = new Schema(
  {
    fileName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    folderId: { type: Schema.Types.ObjectId, ref: "Folder" },
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FileModel = models.File || model<IFile>("File", FileSchema);
export default FileModel;
