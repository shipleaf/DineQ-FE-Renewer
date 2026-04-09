"use client";

import { useCartStore } from "@/store/cartStore";
import { useOrderSubmit } from "@/app/order/hooks/useOrderSubmit";
import CartHeader from "./cart/CartHeader";
import CartEmpty from "./cart/CartEmpty";
import CartItemRow from "./cart/CartItemRow";
import CartCheckoutBar from "./cart/CartCheckoutBar";
import OrderConfirmModal from "./cart/OrderConfirmModal";
import OrderSuccessModal from "./cart/OrderSuccessModal";
import CartLoadingOverlay from "./cart/CartLoadingOverlay";

type CartProps = {
  setIsBottomSheet: (value: boolean) => void;
};

export default function Cart({ setIsBottomSheet }: CartProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = items.length;

  const {
    isLoading,
    showConfirm,
    showSuccess,
    openConfirm,
    closeConfirm,
    closeSuccess,
    handleSuccessConfirm,
    handleSubmit,
  } = useOrderSubmit({ onSuccessClose: () => setIsBottomSheet(false) });

  return (
    <div className="h-[100vh] flex flex-col scrollbar-hide">
      <div className="flex-1 overflow-y-auto pb-4">
        <CartHeader onBack={() => setIsBottomSheet(false)} />
        <div className="menulist px-4 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <CartEmpty />
          ) : (
            <>
              <div className="flex flex-col gap-4 overflow-auto">
                {items.map((item) => (
                  <CartItemRow
                    key={item.menuId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              <CartCheckoutBar
                totalPrice={totalPrice}
                cartCount={cartCount}
                onCheckout={openConfirm}
              />
            </>
          )}
        </div>
        <OrderConfirmModal
          open={showConfirm}
          isLoading={isLoading}
          onConfirm={handleSubmit}
          onCancel={closeConfirm}
        />
      </div>
      <OrderSuccessModal
        open={showSuccess}
        onClose={closeSuccess}
        onConfirm={handleSuccessConfirm}
      />
      {isLoading && <CartLoadingOverlay />}
    </div>
  );
}
