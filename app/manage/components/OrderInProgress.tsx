"use client";

import React, { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";

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

export default function OrderInProgress() {
  const orders: OrderItem[][] = [
    [
      {
        orderId: 9,
        menuName: "순두부찌개",
        quantity: 2,
        totalPrice: 17000,
        orderTime: "2025-04-11T14:04:33.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
      {
        orderId: 9,
        menuName: "순",
        quantity: 2,
        totalPrice: 17000,
        orderTime: "2025-04-11T14:04:33.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
      {
        orderId: 9,
        menuName: "두",
        quantity: 2,
        totalPrice: 17000,
        orderTime: "2025-04-11T14:04:33.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
      {
        orderId: 9,
        menuName: "부",
        quantity: 2,
        totalPrice: 17000,
        orderTime: "2025-04-11T14:04:33.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
      {
        orderId: 9,
        menuName: "찌",
        quantity: 2,
        totalPrice: 17000,
        orderTime: "2025-04-11T14:04:33.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
      {
        orderId: 9,
        menuName: "소주",
        quantity: 2,
        totalPrice: 8000,
        orderTime: "2025-04-11T14:04:33.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
    ],
    [
      {
        orderId: 10,
        menuName: "김치전",
        quantity: 1,
        totalPrice: 20000,
        orderTime: "2025-04-11T14:04:34.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
      {
        orderId: 10,
        menuName: "소주",
        quantity: 1,
        totalPrice: 5000,
        orderTime: "2025-04-11T14:04:34.212405",
        status: "REQUESTED",
        tableId: 1,
        groupNum: "EEE7391C",
      },
    ],
  ];

  const [modalData, setModalData] = useState<OrderItem[] | null>(null);

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
      {/* 하나의 큰 박스 */}
      <div className="h-[90vh] w-[32%] border-2 border-[#f0f0f0] rounded-[10px]">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex">
            <div className="flex items-center gap-1">
              <div className="bg-[#FC0176] w-[24px] h-[24px] flex items-center justify-center rounded-full">
                <FaRegClock color="white" size={18} />
              </div>
              <span className="font-[700] text-[#2a2a2a] text-sm">
                주문처리중
              </span>
            </div>
          </div>
          <span className="font-[500] text-[#808080] text-[10px]">
            주문을 취소하시려면 삭제 버튼을 눌러주세요
          </span>
        </div>

        {/* 여러 주문 묶음 리스트 */}
        <div className="w-full px-2 flex flex-col gap-4 pb-4">
          {orders.map((orderGroup) => (
            <div
              key={orderGroup[0].orderId}
              onClick={() => setModalData(orderGroup)}
              className="cursor-pointer border border-[#f0f0f0] rounded-[10px] p-4 text-sm font-[500] text-[#2a2a2a] flex-col items-center"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="bg-[#D7F4F8] p-2 px-3 rounded-[10px]">
                  <span className="text-[#093AEE] font-bold text-lg">
                    {orderGroup[0].tableId}번
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-[500] text-[#a0a0a0] text-[12px]">{formatOrderTime(orderGroup[0].orderTime)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 모달 열림 방지
                      console.log("케밥 메뉴 클릭!");
                      // TODO: 케밥 버튼 로직 추가
                    }}
                    className="text-[20px] text-[#a0a0a0] cursor-pointer"
                  >
                    <GoKebabHorizontal />
                  </button>
                </div>
              </div>

              {/* 메뉴들 */}
              {orderGroup.slice(0, 4).map((order) => (
                <div
                  key={order.menuName}
                  className="flex items-center justify-between"
                >
                  <span>
                    {order.menuName} × {order.quantity}개
                  </span>
                  <span>{order.totalPrice.toLocaleString()}원</span>
                </div>
              ))}

              {/* +N개 더보기 */}
              {orderGroup.length > 4 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 모달 안 열고 더보기만 처리
                    setModalData(orderGroup);
                  }}
                  className="text-xs text-[#FC0176] underline self-end mr-2"
                >
                  +{orderGroup.length - 4}개 더보기
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {modalData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[40vw] h-[60vh] shadow-2xl overflow-auto flex flex-col">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-center w-full">
                주문 상세
              </h2>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setModalData(null)}
              >
                ✕
              </button>
            </div>

            {/* 주문 목록 */}
            <div className="flex-1 px-4 flex flex-col gap-4">
              <ul className="flex flex-col gap-2 w-full">
                {modalData.map((item) => (
                  <li
                    key={item.menuName}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.menuName} × {item.quantity}
                    </span>
                    <span>{item.totalPrice.toLocaleString()}원</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 하단 버튼 */}
            <div className="mt-6 flex gap-2">
              <button
                className="flex-1 bg-[#FC0176] text-white font-semibold py-2 rounded-lg"
                onClick={() => {
                  // TODO: 수락 처리 로직
                  setModalData(null);
                }}
              >
                주문 수락
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
      )}
    </>
  );
}
