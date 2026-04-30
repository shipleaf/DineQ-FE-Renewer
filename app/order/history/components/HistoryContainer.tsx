"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderHistory } from "@/app/api/order/order.api";
import React from "react";
import { AxiosError } from "axios";

type OrderItem = {
  menuName: string;
  quantity: number;
  totalPrice: number;
  menuPrice: number;
  orderTime: string;
  status: string;
  categoryName: string;
};

export default function HistoryContainer() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order-history", tableId],
    queryFn: () => fetchOrderHistory(token!, tableId!),
    enabled: !!token && !!tableId,
    retry: false,
  });

  const isNoHistoryError =
    isError && (error as AxiosError)?.response?.status === 501;

  if (isLoading)
    return (
      <div className="w-[100vw] flex items-end justify-center">
        <span className="mt-10 loader"></span>
      </div>
    );
  if (isNoHistoryError || !data || data.length === 0)
    return (
      <p className="text-center mt-10 text-[#999]">주문 내역이 없습니다.</p>
    );
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        데이터를 불러오는데 실패했습니다.
        <br />
        새로고침 해주세요.
      </p>
    );

  return (
    <div className="p-4 flex flex-col gap-6">
      {data.map((group: OrderItem[], idx: number) => (
        <div
          key={idx}
          className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 mb-2">
              주문 #{data.length - idx}
            </p>
            <span className="text-sm text-gray-500 mb-2">
              {new Date(
                new Date(group[0].orderTime).getTime() + 9 * 60 * 60 * 1000
              ).toLocaleString()}
            </span>
          </div>
          {group.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div>
                <p className="font-semibold text-[#2a2a2a]">{item.menuName}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity}개 / {item.totalPrice.toLocaleString()}원
                </p>
              </div>
              <span className="text-sm text-gray-400">{item.categoryName}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
