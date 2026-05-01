import { FolderFullDetails } from "./folder";

export interface File {
  id: string;
  mongo_id: string;
  file_name: string;
  title: string;
  description: string | null;
  folder_id: string | null;
  image_url: string | null;
  original_image_url: string | null;
  price: number | null;
  is_new: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FileFullDetails extends File {
  folder?: FolderFullDetails;
}
