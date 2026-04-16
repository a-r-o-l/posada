export interface ProfileChild {
  name: string;
  lastname: string;
  schoolId: string | null;
  gradeId: string | null;
  studentId: string | null;
}

export interface Profile {
  id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  imageUrl: string;
  children: ProfileChild[];
  isNewAccount: boolean;
  availableGrades: string[];
  verified: boolean;
  disabled: boolean;
}
