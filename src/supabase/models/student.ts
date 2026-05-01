import { Grade } from "./grade";
import { School } from "./school";

export interface Student {
  id: string;
  mongo_id: string;
  name: string;
  lastname: string;
  display_name: string;
  grade_id: string;
  school_id: string;
}

export interface StudentFullDetails extends Student {
  school?: School;
  grade?: Grade;
}
