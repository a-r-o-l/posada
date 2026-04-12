export interface School {
  id: string;
  name: string;
  description: string | null;
  password: string | null;
  is_private: boolean | null;
  image_url: string | null;
  folders: string[] | null; // JSONB array de ObjectIds
  created_at: string | null;
  updated_at: string | null;
}
