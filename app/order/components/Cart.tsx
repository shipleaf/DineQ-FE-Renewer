"use client";

import React, { useState } from "react";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa6";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import { createOrders } from "@/app/api/fetchOrderAPI";
import { useSearchParams } from "next/navigation";

type CartProps = {
  setIsBottomSheet: (value: boolean) => void;
};

export default function Cart({ setIsBottomSheet }: CartProps) {
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = useCartStore((state) => state.items.length);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <div className="h-[100vh] flex flex-col scrollbar-hide">
      {/* ✅ 상단: 헤더 + 아이템 리스트 (스크롤 영역) */}
      <div className="flex-1 overflow-y-auto pb-4">
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
              <div className="flex flex-col gap-4 overflow-auto">
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
              <div className="pb-4 flex flex-col gap-2 mb-12">
                <div className="h-[2px] bg-[#f0f0f0] mb-2"></div>
                <div className="flex justify-between text-[16px] font-semibold text-[#7e7e7e]">
                  <span>총 금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              <div className="fixed bottom-0 w-full left-0 right-0 p-4 flex items-center bg-[#fff] justify-between border-t border-[#f0f0f0] rounded-[16px]">
                <div>
                  <span className="text-[#2a2a2a] text-[17px] font-[500]">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
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
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[80%] max-w-[360px] shadow-xl text-center">
              <p className="text-[#2a2a2a] text-base font-semibold mb-4">
                정말 주문하시겠어요?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 rounded bg-[#35CAF4] text-white font-bold"
                  onClick={async () => {
                    try {
                      const orderData = {
                        tableId: 1, // 👉 QR로 받은 tableId 값으로 교체 필요
                        orders: items.map((item) => ({
                          menuId: item.menuId,
                          quantity: item.quantity,
                        })),
                      };

                      if (!token || !tableId) {
                        alert("유효하지 않은 접근입니다.");
                        return;
                      }

                      await createOrders(orderData, token, tableId); // 🔹 주문 요청
                      useCartStore.getState().clearCart(); // 장바구니 비우기

                      setShowSuccessModal(true); // ✅ 모달로 변경
                    } catch (error) {
                      console.error("주문 실패:", error);
                      alert("주문 처리 중 문제가 발생했습니다.");
                    }
                  }}
                >
                  확인
                </button>
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-[#333]"
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[80%] max-w-[360px] shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#2a2a2a] text-base font-semibold mb-4">
              주문이 완료되었습니다.
            </p>
            <p className="text-[#666] text-sm mb-6">감사합니다!</p>
            <button
              className="px-4 py-2 rounded bg-[#35CAF4] text-white font-bold w-full"
              onClick={() => {
                setShowSuccessModal(false);
                setIsBottomSheet(false);
                setShowModal(false);
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
