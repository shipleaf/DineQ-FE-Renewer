"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Cart from "./Cart";

export default function FooterButton() {
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <div className="fixed bottom-4 w-full flex justify-between items-center px-6">
      {/* <button className="bg-[#F0F0F0] w-[33%] py-4 text-lg text-[#2a2a2a] rounded-[10px] font-[700]">
        주문내역
      </button> */}
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
        className={`fixed left-0 right-0 bottom-0 bg-white h-[100vh] z-[100] transition-transform duration-300 ease-in-out ${
          isBottomSheet ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Cart setIsBottomSheet={setIsBottomSheet} />
      </div>
    </div>
  );
}