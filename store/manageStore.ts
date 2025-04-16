import { create } from 'zustand';

type OrderFilterState = {
  showInProgress: boolean;
  showCooking: boolean;
  showReady: boolean;
  toggleFilter: (key: 'showInProgress' | 'showCooking' | 'showReady') => void;
};

export const useOrderFilterStore = create<OrderFilterState>((set) => ({
  showInProgress: true,
  showCooking: true,
  showReady: true,
  toggleFilter: (key) =>
    set((state) => ({
      [key]: !state[key],
    })),
}));