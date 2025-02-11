import { create } from "zustand";

interface AccessState {
  accesses: string[];
  addAccess: (id: string) => void;
  removeAccess: (id: string) => void;
  clearAccess: () => void;
}

export const useCacheSchools = create<AccessState>((set) => ({
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
}));
