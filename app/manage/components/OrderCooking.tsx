import { fetchOrdersInCooking } from "@/app/api/fetchForManagerAPI";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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
  const { data, isLoading, isError } = useQuery<OrderItem[][]>({
    queryKey: ["orders", "in-cooking"],
    queryFn: fetchOrdersInCooking,
    refetchInterval: 10000, // 🔁 10초마다 요청
  });

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
        {data?.map((orderGroup) => (
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
