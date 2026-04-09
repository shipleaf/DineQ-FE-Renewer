// stores/cartStore.ts
import { create } from "zustand";
import type { CartItem } from "@/app/type/cart/cart";
export type { CartItem };

type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "totalPrice">) => void;
  removeFromCart: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.menuId === item.menuId);
      let updatedItems;

      if (existing) {
        updatedItems = state.items.map((i) =>
          i.menuId === item.menuId
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                totalPrice: (i.quantity + item.quantity) * i.price,
              }
            : i
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            ...item,
            totalPrice: item.price * item.quantity,
          },
        ];
      }

      console.log("장바구니에 추가됨:", updatedItems);
      return { items: updatedItems };
    }),

  removeFromCart: (menuId) =>
    set((state) => ({
      items: state.items.filter((item) => item.menuId !== menuId),
    })),

  updateQuantity: (menuId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.menuId === menuId
          ? {
              ...item,
              quantity,
              totalPrice: item.price * quantity,
            }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));