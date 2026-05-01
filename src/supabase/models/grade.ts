export interface Grade {
  id: string;
  mongo_id: string;
  grade: string;
  division: string;
  display_name: string;
  school_id: string;
  year: string | null;
}
