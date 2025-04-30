import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IProd {
  id: string;
  fileId: string;
  productId: string;
  fileTitle: string;
  fileImageUrl: string;
  quantity: number;
  name: string;
  price: number;
  total: number;
}

interface CartState {
  products: IProd[];
  addProduct: (product: IProd) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  addOne: (productId: string) => void;
  removeOne: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product: IProd) =>
        set((state) => {
          const existingProduct = state.products.find(
            (p) => p.id === product.id
          );

          if (existingProduct) {
            return {
              products: state.products.map((p) =>
                p.id === product.id
                  ? {
                      ...p,
                      quantity: p.quantity + product.quantity,
                      total: (p.quantity + product.quantity) * p.price,
                    }
                  : p
              ),
            };
          }

          return {
            products: [...state.products, product],
          };
        }),
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId
          ),
        })),
      clearCart: () => set({ products: [] }),
      addOne: (productId: string) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  quantity: product.quantity + 1,
                  total: (product.quantity + 1) * product.price,
                }
              : product
          ),
        })),
      removeOne: (productId: string) =>
        set((state) => {
          const product = state.products.find((p) => p.id === productId);

          // If product quantity is 1, remove it completely
          if (product && product.quantity === 1) {
            return {
              products: state.products.filter((p) => p.id !== productId),
            };
          }

          // Otherwise decrease quantity by 1
          return {
            products: state.products.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    quantity: product.quantity - 1,
                    total: (product.quantity - 1) * product.price,
                  }
                : product
            ),
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
