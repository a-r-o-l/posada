import { Schema, Document, model, models } from "mongoose";

export interface IGrade extends Document {
  _id: string;
  grade: string;
  division: string;
  displayName: string;
  schoolId: string;
  year: string;
}

export type PartialGrade = Partial<IGrade>;

const GradeSchema: Schema = new Schema(
  {
    grade: { type: String, required: true },
    division: { type: String, required: true },
    displayName: { type: String },
    schoolId: { type: Schema.ObjectId, ref: "School", required: true },
    year: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const GradeModel = models.Grade || model<IGrade>("Grade", GradeSchema);
export default GradeModel;
