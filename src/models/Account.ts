import { Schema, Document, model, models } from "mongoose";
import { IGrade } from "./Grade";
import { ISchool } from "./School";

export interface IAccount extends Document {
  _id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  imageUrl?: string;
  children: IChildren[];
  schoolEngagement: string;
  isNewAccount: boolean;
  availableGrades: string[];
  schoolId?: string;
  verified: boolean;
  disabled?: boolean;
}

export interface IChildren {
  name: string;
  lastname: string;
  gradeId: string;
  schoolId: string;
  studentId?: string;
}

export type IChildrenPopulated = Omit<IChildren, "gradeId" | "schoolId"> & {
  gradeId: IGrade;
  schoolId: ISchool;
};

export type IAccountPopulated = Omit<IAccount, "children"> & {
  children: IChildrenPopulated[];
};

export type PartialAccount = Partial<IAccount>;
export type PartialChildren = Partial<IChildren>;

const ChildSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    schoolId: { type: Schema.ObjectId, ref: "School", required: true },
    gradeId: { type: Schema.ObjectId, ref: "Grade", required: true },
    studentId: { type: Schema.ObjectId, ref: "Student", required: true },
  },
  {
    _id: false,
  }
);

const AccountSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    imageUrl: { type: String },
    children: { type: [ChildSchema], default: [] },
    schoolEngagement: { type: String },
    isNewAccount: { type: Boolean, default: true },
    availableGrades: { type: [Schema.ObjectId], ref: "Grade", default: [] },
    verified: { type: Boolean, default: false },
    schoolId: { type: Schema.ObjectId, ref: "School" },
    disabled: { type: Boolean, default: false },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const AccountModel =
  models.Account || model<IAccount>("Account", AccountSchema);
export default AccountModel;
