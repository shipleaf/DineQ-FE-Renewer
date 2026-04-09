"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { createOrders } from "@/app/api/fetchOrderAPI";

type UseOrderSubmitParams = {
  onSuccessClose: () => void;
};

type UseOrderSubmitReturn = {
  isLoading: boolean;
  showConfirm: boolean;
  showSuccess: boolean;
  openConfirm: () => void;
  closeConfirm: () => void;
  closeSuccess: () => void;
  handleSuccessConfirm: () => void;
  handleSubmit: () => Promise<void>;
};

export function useOrderSubmit({
  onSuccessClose,
}: UseOrderSubmitParams): UseOrderSubmitReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const items = useCartStore((s) => s.items);
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  const openConfirm = useCallback(() => setShowConfirm(true), []);
  const closeConfirm = useCallback(() => setShowConfirm(false), []);
  const closeSuccess = useCallback(() => setShowSuccess(false), []);

  const handleSuccessConfirm = useCallback(() => {
    setShowSuccess(false);
    onSuccessClose();
    setShowConfirm(false);
  }, [onSuccessClose]);

  const handleSubmit = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const orderData = {
        tableId: Number(tableId),
        orders: items.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
      };

      if (!token || !tableId) {
        alert("유효하지 않은 접근입니다.");
        return;
      }

      await createOrders(orderData, token, tableId);
      useCartStore.getState().clearCart();
      setShowSuccess(true);
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 처리 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, items, tableId, token]);

  return {
    isLoading,
    showConfirm,
    showSuccess,
    openConfirm,
    closeConfirm,
    closeSuccess,
    handleSuccessConfirm,
    handleSubmit,
  };
}
