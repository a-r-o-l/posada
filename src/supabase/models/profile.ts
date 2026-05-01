import { ProfileStudentFullDetails } from "./profile_student";

export interface ProfileChild {
  name: string;
  lastname: string;
  school_id: string | null;
  grade_id: string | null;
  student_id: string | null;
}

export interface Profile {
  id: string;
  mongo_id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  image_url: string;
  is_new_account: boolean;
  available_grades: string[];
  verified: boolean;
  disabled: boolean;
}

export interface ProfileFullDetails extends Profile {
  children: ProfileStudentFullDetails[];
}
