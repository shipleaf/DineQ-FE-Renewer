"use client";

import {
  deleteAllOrders,
  fetchOrdersInCooking,
  putCookingToReady,
} from "@/app/api/fetchForManagerAPI";
import { useOrderStatusStore } from "@/store/manageStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { PiCookingPotBold } from "react-icons/pi";

type OrderItem = {
  orderId: number;
  menuName: string;
  quantity: number;
  totalPrice: number;
  orderTime: string;
  status: string;
  tableId: number;
  groupNum: string;
};

export default function OrderCooking() {
  const { data, refetch } = useQuery({
    queryKey: ["orders", "cooking"],
    queryFn: fetchOrdersInCooking,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const cookingUpdated = useOrderStatusStore((state) => state.cookingUpdated);
  const setCookingUpdated = useOrderStatusStore(
    (state) => state.setCookingUpdated
  );

  const [modalData, setModalData] = useState<OrderItem[] | null>(null);
  const [checkedOrderIds, setCheckedOrderIds] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null); // 팝오버용
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // 취소 확인 모달
  const [showCancelSuccess, setShowCancelSuccess] = useState(false); // 취소 완료 모달

  useEffect(() => {
    if (modalData) {
      setCheckedOrderIds(modalData.map((item) => item.orderId));
    }
  }, [modalData]);

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedOrderId(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (cookingUpdated) {
      refetch();
      setCookingUpdated(false);
    }
    // eslint-disable-next-line
  }, [cookingUpdated]);

  const toggleCheckbox = (orderId: number) => {
    setCheckedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatOrderTime = (orderTime: string) => {
    const date = new Date(orderTime);

    const month = date.getMonth() + 1; // 0~11 → +1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const twoDigit = (n: number) => n.toString().padStart(2, "0");

    return `${twoDigit(month)}월 ${twoDigit(day)}일 ${twoDigit(
      hours
    )}시 ${twoDigit(minutes)}분`;
  };

  return (
    <>
      <div className="h-[90vh] w-[32%] border-2 border-[#f0f0f0] rounded-[10px] p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <div className="bg-[#8EABE6] w-[24px] h-[24px] flex items-center justify-center rounded-full">
              <PiCookingPotBold color="white" size={18} />
            </div>
            <span className="font-[700] text-[#2a2a2a] text-sm">조리중</span>
          </div>
          <span className="font-[500] text-[#808080] text-[10px]">
            주문을 취소하시려면 삭제 버튼을 눌러주세요
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-4 h-[90%] overflow-auto scrollbar-hide">
          {data?.map((orderGroup: OrderItem[]) => (
            <div
              key={orderGroup[0].orderId}
              onClick={() => setModalData(orderGroup)}
              className="cursor-pointer border border-[#f0f0f0] rounded-[10px] p-4 text-sm text-[#2a2a2a]"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="bg-[#D7F4F8] p-2 px-3 rounded-[10px]">
                  <span className="text-[#093AEE] font-bold text-lg">
                    {orderGroup[0].tableId}번
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-gray-500">
                    주문번호 #{orderGroup[0].groupNum}
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrderId(orderGroup[0].orderId);
                      }}
                      className="text-[24px] text-[#a0a0a0] cursor-pointer"
                    >
                      <GoKebabHorizontal />
                    </button>

                    {selectedOrderId === orderGroup[0].orderId && (
                      <div
                        className="absolute right-0 top-[-100%] mt-2 bg-white border border-gray-200 shadow-md rounded-md z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="block px-4 py-2 text-sm hover:bg-gray-100 text-red-500 w-[100px]"
                          onClick={() => {
                            setShowCancelConfirm(true);
                            setModalData(null);
                          }}
                        >
                          주문 취소
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {showCancelConfirm && (
                <div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  <div
                    className="bg-white rounded-xl p-6 w-[300px] shadow-2xl text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="mb-4 font-semibold text-[#2a2a2a]">
                      해당 주문을 취소하시겠습니까?
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white font-[700] rounded-md"
                        onClick={async () => {
                          try {
                            await deleteAllOrders(selectedOrderId!); // API 호출
                            setShowCancelConfirm(false);
                            setSelectedOrderId(null);
                            setShowCancelSuccess(true);
                            refetch(); // 목록 갱신
                          } catch (e) {
                            alert("취소 실패");
                            console.error(e);
                          }
                        }}
                      >
                        확인
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-[#2a2a2a] font-[700]"
                        onClick={() => setShowCancelConfirm(false)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showCancelSuccess && (
                <div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setShowCancelSuccess(false)}
                >
                  <div
                    className="bg-white rounded-xl p-6 w-[280px] shadow-2xl text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-[#2a2a2a] font-bold mb-2">
                      주문이 취소되었습니다
                    </p>
                    <button
                      className="mt-4 bg-[#35CAF4] text-white px-4 py-2 rounded-md w-full"
                      onClick={() => setShowCancelSuccess(false)}
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}
              {orderGroup.slice(0, 4).map((item) => (
                <div
                  key={item.menuName}
                  className="flex justify-between items-center font-[600]"
                >
                  <span>
                    {item.menuName} × {item.quantity}개
                  </span>
                  <span>{item.totalPrice.toLocaleString()}원</span>
                </div>
              ))}
              {orderGroup.length > 4 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalData(orderGroup);
                  }}
                  className="text-xs text-[#FC0176] underline self-end mt-2"
                >
                  +{orderGroup.length - 4}개 더보기
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[40vw] h-[60vh] shadow-2xl flex flex-col">
            {/* 최상단 정보 영역 */}
            <div className="mb-2 px-4">
              <h2 className="text-lg font-bold text-center w-full">
                주문 상세
              </h2>
              <div className="font-[500] text-[#a0a0a0] text-[12px] text-end">
                {formatOrderTime(modalData[0].orderTime)}
              </div>
              <div className="font-[500] text-[#a0a0a0] text-[12px] text-end">
                주문번호 #{modalData[0].orderId}
              </div>
            </div>

            {/* ✅ 스크롤 가능한 영역 */}
            <ul className="flex-1 overflow-auto flex flex-col gap-2 px-4 scrollbar-thin-custom">
              {modalData.map((item) => (
                <li
                  key={item.menuName}
                  className="flex justify-between text-sm"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedOrderIds.includes(item.orderId)}
                      onChange={() => toggleCheckbox(item.orderId)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition ${
                        checkedOrderIds.includes(item.orderId)
                          ? "bg-[#35CAF4] border-[#35CAF4]"
                          : "bg-white border-gray-400"
                      }`}
                    >
                      {checkedOrderIds.includes(item.orderId) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>
                      {item.menuName} × {item.quantity}
                    </span>
                  </label>
                  <span>{item.totalPrice.toLocaleString()}원</span>
                </li>
              ))}
            </ul>

            {/* 하단 총합 및 버튼 */}
            <div className="mt-6 flex flex-col gap-4 w-full">
              <p className="text-right font-semibold">
                총합:{" "}
                {modalData
                  ?.reduce((acc, cur) => acc + cur.totalPrice, 0)
                  .toLocaleString()}
                원
              </p>
              <div className="w-full flex gap-2">
                <button
                  className="flex-1 bg-[#35CAF4] text-white font-semibold py-2 rounded-lg"
                  onClick={() => setShowConfirmModal(true)}
                >
                  조리 완료
                </button>
                <button
                  className="w-[100px] bg-gray-200 text-[#2a2a2a] font-medium py-2 rounded-lg"
                  onClick={() => setModalData(null)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[300px] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 font-semibold text-[#2a2a2a]">
              조리 완료 상태로 변경하시겠습니까?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-[#35CAF4] text-white font-[700] rounded-md"
                onClick={async () => {
                  try {
                    await putCookingToReady(checkedOrderIds);
                    setShowConfirmModal(false);
                    setModalData(null);
                    setShowSuccessModal(true);
                    setCookingUpdated(true);
                    refetch();
                  } catch (e) {
                    alert("주문 수락 실패");
                    console.error(e);
                    setShowConfirmModal(false);
                  }
                }}
              >
                확인
              </button>
              <button
                className="px-4 py-2 rounded-md text-[#2a2a2a] font-[700]"
                onClick={() => setShowConfirmModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[280px] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#2a2a2a] font-bold mb-2">
              조리가 완료되었습니다
            </p>
            <button
              className="mt-4 bg-[#35CAF4] text-white px-4 py-2 rounded-md w-full"
              onClick={() => setShowSuccessModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
