import { create } from 'zustand';

type OrderFilterState = {
  showInProgress: boolean;
  showCooking: boolean;
  showReady: boolean;
  toggleFilter: (key: 'showInProgress' | 'showCooking' | 'showReady') => void;
};

type OrderStatusState = {
  cookingUpdated: boolean;
  setCookingUpdated: (value: boolean) => void;
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

export const useOrderStatusStore = create<OrderStatusState>((set) => ({
  cookingUpdated: false,
  setCookingUpdated: (value) => set({ cookingUpdated: value }),
}));