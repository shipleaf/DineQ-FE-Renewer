"use client";

import {
  fetchOrdersInReady,
} from "@/app/api/fetchForManagerAPI";
import { useOrderStatusStore } from "@/store/manageStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { LuCookingPot } from "react-icons/lu";

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
    queryKey: ["orders", "ready"],
    queryFn: fetchOrdersInReady,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const cookingUpdated = useOrderStatusStore((state) => state.cookingUpdated);
  const setCookingUpdated = useOrderStatusStore(
    (state) => state.setCookingUpdated
  );

  const [modalData, setModalData] = useState<OrderItem[] | null>(null);


  useEffect(() => {
    if (cookingUpdated) {
      refetch();
      setCookingUpdated(false);
    }
    // eslint-disable-next-line
  }, [cookingUpdated]);

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
      <div className="h-[90vh] w-[100%] border-2 border-[#f0f0f0] rounded-[10px] p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <div className="bg-[#8B8BE1] w-[24px] h-[24px] flex items-center justify-center rounded-full">
              <LuCookingPot color="white" size={18} />
            </div>
            <span className="font-[700] text-[#2a2a2a] text-sm">조리완료</span>
          </div>
          <span className="font-[500] text-[#808080] text-[10px]">
            조리완료된 주문내역입니다
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-4 h-[90%] overflow-auto scrollbar-always">
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
                <span className="text-xs text-gray-500">
                  주문번호 #{orderGroup[0].groupNum}
                </span>
              </div>
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

        {modalData && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[40vw] h-[60vh] shadow-2xl overflow-auto flex flex-col">
              <div className="flex items-center mb-4 px-2 flex-col w-full justify-between h-full">
                <div className="flex-1 px-4 flex flex-col gap-10 w-full">
                  <h2 className="text-lg font-bold text-center w-full flex flex-col">
                    <div>주문 상세</div>
                    <div className="font-[500] text-[#a0a0a0] text-[12px] w-full text-end">
                      {formatOrderTime(modalData[0].orderTime)}
                    </div>
                    <div className="font-[500] text-[#a0a0a0] text-[12px] w-full text-end">
                      주문번호 #{modalData[0].groupNum}
                    </div>
                  </h2>
                  <ul className="flex flex-col gap-2 w-full font-[600]">
                    {modalData.map((item) => (
                      <li
                        key={item.menuName}
                        className="flex justify-between text-sm"
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span>
                            {item.menuName} × {item.quantity}
                          </span>
                        </label>
                        <span>{item.totalPrice.toLocaleString()}원</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-col gap-4 w-full">
                  <div className="flex items-center justify-end">
                    <p className="text-right font-semibold">
                      총합:{" "}
                      {modalData
                        ?.reduce((acc, cur) => acc + cur.totalPrice, 0)
                        .toLocaleString()}
                      원
                    </p>
                  </div>
                  <button
                    className="w-full bg-gray-200 text-[#2a2a2a] font-medium py-2 rounded-lg"
                    onClick={() => setModalData(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
