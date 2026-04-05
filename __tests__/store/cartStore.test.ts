import { useCartStore } from "@/store/cartStore";

// 각 테스트 전 스토어 초기화
beforeEach(() => {
  useCartStore.setState({ items: [] });
});

const mockItem = {
  menuId: 1,
  name: "된장찌개",
  price: 8000,
  quantity: 1,
  image: "/food.jpg",
};

describe("cartStore", () => {
  describe("addToCart", () => {
    it("새 아이템을 장바구니에 추가한다", () => {
      useCartStore.getState().addToCart(mockItem);
      const { items } = useCartStore.getState();

      expect(items).toHaveLength(1);
      expect(items[0].menuId).toBe(1);
      expect(items[0].name).toBe("된장찌개");
    });

    it("추가 시 totalPrice = price * quantity 로 계산된다", () => {
      useCartStore.getState().addToCart({ ...mockItem, price: 8000, quantity: 2 });
      const { items } = useCartStore.getState();

      expect(items[0].totalPrice).toBe(16000);
    });

    it("동일한 menuId 아이템을 추가하면 quantity가 누적된다", () => {
      useCartStore.getState().addToCart({ ...mockItem, quantity: 1 });
      useCartStore.getState().addToCart({ ...mockItem, quantity: 2 });
      const { items } = useCartStore.getState();

      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it("동일한 menuId 재추가 시 totalPrice가 누적 quantity 기준으로 재계산된다", () => {
      useCartStore.getState().addToCart({ ...mockItem, price: 8000, quantity: 1 });
      useCartStore.getState().addToCart({ ...mockItem, price: 8000, quantity: 2 });
      const { items } = useCartStore.getState();

      // quantity 3 * price 8000 = 24000
      expect(items[0].totalPrice).toBe(24000);
    });

    it("다른 menuId 아이템은 별도 항목으로 추가된다", () => {
      useCartStore.getState().addToCart({ ...mockItem, menuId: 1 });
      useCartStore.getState().addToCart({ ...mockItem, menuId: 2, name: "김치찌개" });
      const { items } = useCartStore.getState();

      expect(items).toHaveLength(2);
    });
  });

  describe("removeFromCart", () => {
    it("해당 menuId 아이템만 제거한다", () => {
      useCartStore.getState().addToCart({ ...mockItem, menuId: 1 });
      useCartStore.getState().addToCart({ ...mockItem, menuId: 2, name: "김치찌개" });
      useCartStore.getState().removeFromCart(1);
      const { items } = useCartStore.getState();

      expect(items).toHaveLength(1);
      expect(items[0].menuId).toBe(2);
    });

    it("존재하지 않는 menuId를 제거해도 에러 없이 동작한다", () => {
      useCartStore.getState().addToCart(mockItem);
      useCartStore.getState().removeFromCart(999);
      const { items } = useCartStore.getState();

      expect(items).toHaveLength(1);
    });
  });

  describe("updateQuantity", () => {
    it("quantity를 변경하고 totalPrice를 재계산한다", () => {
      useCartStore.getState().addToCart({ ...mockItem, price: 8000, quantity: 1 });
      useCartStore.getState().updateQuantity(1, 3);
      const { items } = useCartStore.getState();

      expect(items[0].quantity).toBe(3);
      expect(items[0].totalPrice).toBe(24000);
    });

    it("다른 아이템의 quantity는 변경되지 않는다", () => {
      useCartStore.getState().addToCart({ ...mockItem, menuId: 1, price: 8000, quantity: 1 });
      useCartStore.getState().addToCart({ ...mockItem, menuId: 2, price: 5000, quantity: 1 });
      useCartStore.getState().updateQuantity(1, 5);
      const { items } = useCartStore.getState();

      const item2 = items.find((i) => i.menuId === 2);
      expect(item2?.quantity).toBe(1);
      expect(item2?.totalPrice).toBe(5000);
    });
  });

  describe("clearCart", () => {
    it("모든 아이템을 제거한다", () => {
      useCartStore.getState().addToCart({ ...mockItem, menuId: 1 });
      useCartStore.getState().addToCart({ ...mockItem, menuId: 2 });
      useCartStore.getState().clearCart();
      const { items } = useCartStore.getState();

      expect(items).toHaveLength(0);
    });
  });
});
