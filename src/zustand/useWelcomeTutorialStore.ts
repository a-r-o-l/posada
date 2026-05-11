import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WelcomeTutorialState {
  hasSeenTutorial: boolean;
  hasHydrated: boolean;
  markTutorialAsSeen: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useWelcomeTutorialStore = create<WelcomeTutorialState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      hasHydrated: false,
      markTutorialAsSeen: () => set({ hasSeenTutorial: true }),
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    }),
    {
      name: "welcome-tutorial-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
