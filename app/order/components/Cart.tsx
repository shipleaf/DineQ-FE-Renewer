"use client";

import React from "react";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa6";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";

type CartProps = {
  setIsBottomSheet: (value: boolean) => void;
};

export default function Cart({ setIsBottomSheet }: CartProps) {
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = useCartStore((state) => state.items.length);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div>
      <div className="p-4 py-6 grid grid-cols-5 items-center">
        <button onClick={() => setIsBottomSheet(false)}>
          <FaArrowLeft color="#2a2a2a" size={20} />
        </button>
        <span className="text-lg font-bold col-span-3 text-center text-[#2a2a2a]">
          장바구니
        </span>
        <div></div>
      </div>
      <div className="bg-[#f0f0f0] h-[2px] w-full"></div>
      <div className="menulist px-4 py-4 flex flex-col gap-4">
        {items.length === 0 ? (
          <p className="text-center text-[#999] py-10">
            장바구니가 비어 있어요.
          </p>
        ) : (
          <>
            {/* 🧾 장바구니 아이템 목록 */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.menuId}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[#2a2a2a] text-[16px]">
                      {item.name}
                    </span>
                    <span className="text-sm text-[#666]">
                      {item.quantity}개 / {item.totalPrice.toLocaleString()}원
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.menuId, item.quantity - 1);
                          } else {
                            alert(
                              "1개 이하로 줄일 수 없어요. 상품을 삭제합니다."
                            );
                            removeFromCart(item.menuId);
                          }
                        }}
                        disabled={item.quantity === 1}
                        className={`p-2 rounded text-[16px] font-bold 
    ${
      item.quantity === 1
        ? "bg-[#e0e0e0] text-white cursor-not-allowed"
        : "bg-[#e0e0e0] text-[#5E5E5E]"
    }
  `}
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="min-w-[24px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          updateQuantity(item.menuId, item.quantity + 1);
                        }}
                        className="p-2 bg-[#e0e0e0] rounded text-[16px] font-bold"
                      >
                        <FaPlus size={12} />
                      </button>
                      <button
                        onClick={() => {
                          const isConfirmed = confirm(
                            "해당 상품을 장바구니에서 삭제할까요?"
                          );
                          if (isConfirmed) {
                            removeFromCart(item.menuId);
                          }
                        }}
                        className="ml-2 text-[#666]"
                        title="삭제"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                  <Image
                    src={item.image || "/DineQLogo.png"}
                    alt={`${item.name} 이미지`}
                    width={80}
                    height={60}
                    className="rounded-[10px] object-cover"
                  />
                </div>
              ))}
            </div>
            {/* 💰 총 가격 및 액션 버튼 */}
            <div className="pt-4 flex flex-col gap-2">
              <div className="h-[2px] bg-[#f0f0f0] mb-2"></div>
              <div className="flex justify-between text-[16px] font-semibold text-[#7e7e7e]">
                <span>총 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </div>

            <div className="fixed bottom-0 w-full left-0 right-0 p-4 flex items-center justify-between border-t border-[#f0f0f0] rounded-[16px]">
              <div>
                <span className="text-[#2a2a2a] text-[17px] font-[500]">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
              <button
                onClick={() => {
                  const isConfirmed = confirm("정말 주문하시겠어요?");
                  if (isConfirmed) {
                    useCartStore.getState().clearCart();
                    alert("주문이 완료되었습니다. 감사합니다!");
                    setIsBottomSheet(false);
                  }
                }}
                className="mt-2 bg-[#35CAF4] text-white text-[16px] w-[50%] py-3 rounded-[10px] font-bold flex items-center justify-center gap-1"
              >
                <span>주문하기</span>
                <div className="w-[20px] h-[20px] rounded-full bg-white text-[#35CAF4] flex items-center justify-center">
                  {cartCount}
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
