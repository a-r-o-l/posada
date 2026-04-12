export interface ProfileChild {
  name: string;
  lastname: string;
  schoolId: string | null;
  gradeId: string | null;
}

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  lastname: string | null;
  type: string | null;
  status: string | null;
  profile_image: string | null;
  whatsapp: string | null;
  available_grades: string[] | null; // array de ObjectIds
  verified: boolean | null;
  children: ProfileChild[] | null;
  first_login: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}
