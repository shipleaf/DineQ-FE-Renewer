import React from "react";
import { LuCookingPot } from "react-icons/lu";

const data = [
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
      menuName: "소주",
      quantity: 2,
      totalPrice: 12000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 1,
      groupNum: "EEE7391C",
    },
  ],
  [
    {
      orderId: 10,
      menuName: "까만찜닭",
      quantity: 1,
      totalPrice: 17000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
    {
      orderId: 10,
      menuName: "소주",
      quantity: 2,
      totalPrice: 12000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
  ],
  [
    {
      orderId: 11,
      menuName: "까만찜닭",
      quantity: 1,
      totalPrice: 17000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
    {
      orderId: 11,
      menuName: "소주",
      quantity: 2,
      totalPrice: 12000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
  ],
  [
    {
      orderId: 12,
      menuName: "까만찜닭",
      quantity: 1,
      totalPrice: 17000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
    {
      orderId: 12,
      menuName: "소주",
      quantity: 2,
      totalPrice: 12000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
  ],
  [
    {
      orderId: 13,
      menuName: "까만찜닭",
      quantity: 1,
      totalPrice: 17000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
    {
      orderId: 13,
      menuName: "소주",
      quantity: 2,
      totalPrice: 12000,
      orderTime: "2025-04-11T14:04:33.212405",
      status: "REQUESTED",
      tableId: 2,
      groupNum: "EEE7391C",
    },
  ],
];

export default function OrderCooking() {
  return (
    <div className="h-[90vh] w-[32%] border-2 border-[#f0f0f0] rounded-[10px] p-4">
      <div className="flex flex-col gap-2">
        <div className="flex">
          <div className="flex items-center gap-1">
            <div className="bg-[#8EABE6] w-[24px] h-[24px] flex items-center justify-center rounded-full">
              <LuCookingPot color="white" size={18} />
            </div>
            <span className="font-[700] text-[#2a2a2a] text-sm">조리중</span>
          </div>
          <button></button>
        </div>
        <span className="font-[500] text-[#808080] text-[10px]">
          주문을 취소하시려면 삭제 버튼을 눌러주세요
        </span>
      </div>
      <div className="flex flex-col gap-4 mt-4 h-[90%] overflow-auto">
        {data.map((orderGroup) => (
          <div
            key={orderGroup[0].orderId}
            className="border border-[#f0f0f0] rounded-[10px] p-4 text-sm text-[#2a2a2a]"
          >
            {/* 테이블 번호와 주문 번호 */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[#093AEE]">
                {orderGroup[0].tableId}번 테이블
              </span>
              <span className="text-xs text-gray-500">
                주문번호 #{orderGroup[0].orderId}
              </span>
            </div>

            {/* 메뉴들 매핑 */}
            <div className="flex flex-col gap-1">
              {orderGroup.map((item) => (
                <div
                  key={item.menuName}
                  className="flex justify-between items-center"
                >
                  <span>
                    {item.menuName} × {item.quantity}개
                  </span>
                  <span>{item.totalPrice.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
