export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  schoolId: string;
  isDownloadable: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
