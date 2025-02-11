import { Schema, Document, model, models } from "mongoose";
import { IGrade } from "./Grade";

export interface IStudent extends Document {
  _id: string;
  name: string;
  lastname: string;
  displayName: string;
  gradeId: string;
  schoolId: string;
}

export type PartialStudent = Partial<IStudent>;
export type IStudentWP = Omit<IStudent, "gradeId"> & { gradeId: IGrade };

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    displayName: { type: String },
    gradeId: { type: Schema.ObjectId, ref: "Grade", required: true },
    schoolId: { type: Schema.ObjectId, ref: "School", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const StudentModel =
  models.Student || model<IStudent>("Student", StudentSchema);
export default StudentModel;
