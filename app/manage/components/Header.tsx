"use client";

import { useOrderFilterStore } from "@/store/manageStore";
import Image from "next/image";
import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import { useRouter } from "next/navigation";
import {
  addTable,
  deleteTable,
  fetchTableOrders,
  payingTableOrders,
} from "@/app/api/fetchForManagerAPI";

type OrderItem = {
  menuName: string;
  quantity: number;
  totalPrice: number;
  menuPrice: number;
  orderTime: string;
  status: string;
  categoryName: string;
};

export default function Header() {
  const { showInProgress, showCooking, showReady, toggleFilter } =
    useOrderFilterStore();

  const checkboxes = [
    { id: "before", label: "주문처리중", stateKey: "showInProgress" },
    { id: "cooking", label: "조리중", stateKey: "showCooking" },
    { id: "cooked", label: "조리완료", stateKey: "showReady" },
  ] as const;

  const router = useRouter();
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | "">("");
  const [tableOrders, setTableOrders] = useState<OrderItem[][]>([]);
  const [showConfirmPayModal, setShowConfirmPayModal] = useState(false);
  const [showSuccessPayModal, setShowSuccessPayModal] = useState(false);

  return (
    <div className="grid grid-cols-5 items-center justify-between p-4">
      <div className="flex items-center">
        <Image src="/image.png" alt="" width={48} height={24} />
        <span className="font-[700] text-[#4E4868] text-[24px]">DineQ</span>
      </div>
      <div className="flex items-center justify-center gap-4 col-span-3 text-[#4E4868] font-[700] text-md">
        {checkboxes.map(({ id, label, stateKey }) => (
          <div key={id} className="flex items-center">
            <input
              id={id}
              type="checkbox"
              className="peer hidden"
              checked={
                stateKey === "showInProgress"
                  ? showInProgress
                  : stateKey === "showCooking"
                  ? showCooking
                  : showReady
              }
              onChange={() => toggleFilter(stateKey)}
            />
            <label
              htmlFor={id}
              className="flex items-center gap-2 cursor-pointer before:content-[''] before:inline-block before:w-4 before:h-4 before:rounded before:border before:border-gray-400 peer-checked:before:bg-[#4E4868] peer-checked:before:border-[#4E4868] text-sm text-[#4E4868] font-bold"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3">
        <button
          className="text-md text-[#4E4868] font-[700] text-sm"
          onClick={() => {
            router.push("/manage/menu");
          }}
        >
          메뉴관리
        </button>
        <div
          className="rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer"
          onClick={() => setShowTableModal(true)}
        >
          <TbClipboardList size={24} color="#808080" />
        </div>
        <div className="rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer">
          <BsGear size={20} color="#808080" />
        </div>
        <div
          className="relative rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer"
          onClick={() => setShowLogoutBox(true)}
        >
          <FaRegUserCircle size={22} color="#808080" />
          {showLogoutBox && (
            <div className="absolute z-[100] w-[100px] inset-0 top-[100%] right-[100%]">
              <span>로그아웃</span>
            </div>
          )}
        </div>
      </div>
      {showTableModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90vw] max-w-[500px] shadow-xl space-y-4 relative">
            <h2 className="text-lg font-bold text-center">테이블 정산</h2>

            <div>
              <label className="text-sm font-semibold">테이블 번호 선택</label>
              <select
                className="w-full border px-3 py-2 rounded mt-1"
                value={selectedTableId}
                onChange={async (e) => {
                  const table_id = Number(e.target.value);

                  if (!table_id || isNaN(table_id)) {
                    setSelectedTableId("");
                    setTableOrders([]);
                    return;
                  }

                  setSelectedTableId(table_id);

                  try {
                    const res = await fetchTableOrders(table_id);
                    setTableOrders(res);
                  } catch (err) {
                    console.error("주문 조회 실패", err);
                    alert("주문 조회 실패");
                  }
                }}
              >
                <option value="">번호 선택</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}번 테이블
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-[200px] overflow-y-auto text-sm">
              {tableOrders.length === 0 ? (
                <p className="text-center text-[#888]">주문 내역이 없습니다.</p>
              ) : (
                tableOrders.flat().map((order, idx) => (
                  <div key={idx} className="border-b py-2 flex justify-between">
                    <div>
                      <p className="font-bold">{order.menuName}</p>
                      <p className="text-xs text-[#666]">
                        {order.quantity}개 / {order.totalPrice.toLocaleString()}
                        원
                      </p>
                    </div>
                    <p className="text-right text-sm text-[#333]">
                      {order.categoryName}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-2 text-right font-bold text-[#2a2a2a]">
              총 금액:{" "}
              {tableOrders.length > 0
                ? tableOrders
                    .flat()
                    .reduce((sum, o) => sum + o.totalPrice, 0)
                    .toLocaleString()
                : "0"}
              원
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded bg-green-500 text-white text-sm"
                  onClick={async () => {
                    try {
                      await addTable();
                      alert("테이블이 추가되었습니다.");
                      // optional: 리프레시 or 테이블 수 업데이트
                    } catch (err) {
                      console.error("테이블 추가 실패", err);
                      alert("테이블 추가 실패");
                    }
                  }}
                >
                  테이블 추가
                </button>
                <button
                  className="px-3 py-2 rounded bg-red-500 text-white text-sm"
                  onClick={async () => {
                    try {
                      await deleteTable();
                      alert("테이블이 삭제되었습니다.");
                      // optional: 리프레시 or 테이블 수 업데이트
                    } catch (err) {
                      console.error("테이블 삭제 실패", err);
                      alert("테이블 삭제 실패");
                    }
                  }}
                >
                  테이블 삭제
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 text-[#333]"
                  onClick={() => {
                    setShowTableModal(false);
                    setSelectedTableId("");
                  }}
                >
                  닫기
                </button>
                {tableOrders.length > 0 && (
                  <button
                    className="px-4 py-2 rounded bg-blue-500 text-white"
                    onClick={() => setShowConfirmPayModal(true)}
                  >
                    정산하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirmPayModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-xl text-center">
            <p className="text-[#2a2a2a] font-bold mb-2">정산 확인</p>
            <p className="text-sm text-[#666]">
              정말 {selectedTableId}번 테이블을 정산하시겠습니까?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-[#333]"
                onClick={() => {
                  setShowConfirmPayModal(false);
                  setSelectedTableId("");
                }}
              >
                취소
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={async () => {
                  try {
                    await payingTableOrders(Number(selectedTableId));
                    setShowConfirmPayModal(false);
                    setShowSuccessPayModal(true);
                    setShowTableModal(false);
                  } catch (err) {
                    console.error("정산 실패", err);
                    alert("정산 실패");
                  }
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessPayModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-xl text-center">
            <p className="text-green-600 font-bold mb-2">
              {selectedTableId}번 테이블 정산 완료
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => {
                setShowSuccessPayModal(false);
                setSelectedTableId("");
                setTableOrders([]);
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
