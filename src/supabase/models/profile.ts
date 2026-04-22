export interface ProfileChild {
  name: string;
  lastname: string;
  schoolId: string | null;
  gradeId: string | null;
  studentId: string | null;
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
  children: ProfileChild[];
  is_new_account: boolean;
  available_grades: string[];
  verified: boolean;
  disabled: boolean;
}
