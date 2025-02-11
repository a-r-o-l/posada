import { Schema, Document, model, models } from "mongoose";

export interface IMessage extends Document {
  _id: string;
  date: Date;
  title: string;
  text: string;
  isNewMessage: boolean;
  name: string;
  email: string;
}

export type PartialMessage = Partial<IMessage>;

const MessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    title: { type: String },
    text: { type: String, required: true },
    isNewMessage: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MessageModel =
  models.Message || model<IMessage>("Message", MessageSchema);
export default MessageModel;
