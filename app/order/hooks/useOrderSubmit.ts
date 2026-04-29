"use client";

import { useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { createOrders } from "@/app/api/order/order.api";

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

  const isSubmittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  const items = useCartStore((s) => s.items);
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  const openConfirm = useCallback(() => setShowConfirm(true), []);
  const closeConfirm = useCallback(() => {
    setShowConfirm(false);
    idempotencyKeyRef.current = null; // 취소 시 다음 시도는 새 키
  }, []);
  const closeSuccess = useCallback(() => setShowSuccess(false), []);

  const handleSuccessConfirm = useCallback(() => {
    setShowSuccess(false);
    onSuccessClose();
    setShowConfirm(false);
  }, [onSuccessClose]);

  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return; // 동기 가드
    isSubmittingRef.current = true;

    setIsLoading(true);

    try {
      if (!token || !tableId) {
        alert("유효하지 않은 접근입니다.");
        return;
      }

      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID();
      }

      const orderData = {
        tableId: Number(tableId),
        orders: items.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
      };

      await createOrders(orderData, token, tableId, idempotencyKeyRef.current);

      idempotencyKeyRef.current = null; // 성공 시 다음 주문은 새 키
      useCartStore.getState().clearCart();
      setShowSuccess(true);
    } catch (error) {
      console.error("주문 실패:", error);
      alert("주문 처리 중 문제가 발생했습니다.");
      // 실패 시 키 유지 → 재시도는 같은 키로
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }, [items, tableId, token]);

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
