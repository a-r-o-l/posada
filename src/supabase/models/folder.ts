import { File } from "./file";
import { Product } from "./product";
import { School } from "./school";

export interface Folder {
  id: string;
  mongo_id: string;
  type: string | null;
  title: string;
  description: string | null;
  school_id: string;
  password: string | null;
  is_private: boolean | null;
  image_url: string | null;
  grades: string[] | null;
  parent_folder: string | null;
  year: string | null;
  level: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FolderFullDetails extends Folder {
  school?: School;
  files?: File[];
  products?: Product[];
}
