import { create } from "zustand";

type OrderFilterState = {
  showInProgress: boolean;
  showCooking: boolean;
  showReady: boolean;
  toggleFilter: (key: "showInProgress" | "showCooking" | "showReady") => void;
};

type OrderStatusState = {
  cookingUpdated: boolean; // 조리 중, 조리 완료
  setCookingUpdated: (value: boolean) => void;

  inProgressUpdated: boolean; // 주문 대기
  setInProgressUpdated: (v: boolean) => void;

  readyUpdated: boolean;
  setReadyUpdated: (v: boolean) => void;
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

  inProgressUpdated: true,
  setInProgressUpdated: (v) => set({ inProgressUpdated: v }),

  readyUpdated: false,
  setReadyUpdated: (v) => set({ readyUpdated: v }),
}));
