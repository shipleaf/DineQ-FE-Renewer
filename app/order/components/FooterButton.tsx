"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Cart from "./Cart";

export default function FooterButton() {
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const cartCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    if (isBottomSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 언마운트시 복구
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBottomSheet]);

  return (
    <div className="fixed bottom-4 w-full flex justify-between items-center px-6">
      <button
        className="bg-[#35CAF4] w-full py-3 text-white font-[700] text-lg rounded-[10px] flex items-center justify-center gap-2"
        onClick={() => setIsBottomSheet(true)}
      >
        <span>장바구니</span>
        {cartCount >= 1 && (
          <span className="rounded-full bg-white text-[14px] w-[24px] h-[24px] text-[#35CAF4] flex items-center justify-center">
            {` ${cartCount}`}
          </span>
        )}
      </button>
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white z-[100] h-[100vh] transition-transform duration-300 ease-in-out overflow-y-auto ${
          isBottomSheet ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Cart setIsBottomSheet={setIsBottomSheet} />
      </div>
    </div>
  );
}
