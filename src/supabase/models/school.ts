import { Folder } from "./folder";
import { Grade } from "./grade";

export interface School {
  id: string;
  mongo_id: string;
  name: string;
  description: string;
  password?: string;
  is_private?: boolean;
  image_url?: string;
  folders: Folder[];
  created_at: string;
  updated_at: string;
}

export interface SchoolFullDetails extends School {
  grades?: Grade[];
}
