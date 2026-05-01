import { Grade } from "./grade";
import { School } from "./school";
import { StudentFullDetails } from "./student";

export interface ProfileStudent {
  id: string;
  profile_id: string;
  student_id: string;
  created_at: string;
}

export interface ProfileStudentFullDetails extends ProfileStudent {
  student?: StudentFullDetails;
  school?: School;
  grade?: Grade;
}
