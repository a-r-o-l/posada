import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AccessState {
  accesses: string[];
  addAccess: (id: string) => void;
  removeAccess: (id: string) => void;
  clearAccess: () => void;
}

export const useCacheSchools = create<AccessState>()(
  persist(
    (set) => ({
      accesses: [],
      addAccess: (id: string) =>
        set((state) => ({
          accesses: [...state.accesses, id],
        })),
      removeAccess: (id) =>
        set((state) => ({
          accesses: state.accesses.filter((school) => school !== id),
        })),
      clearAccess: () => set({ accesses: [] }),
    }),
    {
      name: "schools-access-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
