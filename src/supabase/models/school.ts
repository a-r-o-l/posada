import { Folder } from "./folder";

export interface School {
  id: string;
  name: string;
  description: string;
  password?: string;
  isPrivate?: boolean;
  imageUrl?: string;
  folders: Folder[];
  createdAt: string;
  updatedAt: string;
}
