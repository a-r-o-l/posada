export interface File {
  id: string;
  fileName: string;
  title: string;
  description: string | null;
  folderId: string | null;
  imageUrl: string | null;
  originalImageUrl: string | null;
  price: number | null;
  isNew: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}
