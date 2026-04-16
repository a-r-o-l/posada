export interface Folder {
  id: string;
  type: string | null;
  title: string;
  description: string | null;
  schoolId: string;
  password: string | null;
  isPrivate: boolean | null;
  imageUrl: string | null;
  grades: string[] | null; // JSONB array de ObjectIds
  parentFolder: string | null;
  year: string | null;
  level: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
