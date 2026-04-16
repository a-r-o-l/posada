import { Schema, Document, model, models } from "mongoose";

export interface DPicture extends Document {
  _id: string;
  fileName: string;
  url?: string;
  accountId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DPictureSchema: Schema = new Schema(
  {
    fileName: { type: String, required: true },
    url: { type: String },
    accountId: { type: String, required: true },
    fileId: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const DPictureModel =
  models.DownloabledPicture ||
  model<DPicture>("DownloabledPicture", DPictureSchema);
export default DPictureModel;
