"use client";

import { useOrderFilterStore, useOrderStatusStore } from "@/store/manageStore";
import Image from "next/image";
import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react"; // 추가
import {
  addTable,
  deleteTable,
  fetchTableOrders,
  getTableNumber,
  payingTableOrders,
} from "@/app/api/fetchForManagerAPI";
import { logout } from "@/app/api/useLoginAPI";

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

  const setCookingUpdated = useOrderStatusStore(
    (state) => state.setCookingUpdated
  );

  const checkboxes = [
    { id: "before", label: "주문처리중", stateKey: "showInProgress" },
    { id: "cooking", label: "조리중", stateKey: "showCooking" },
    { id: "cooked", label: "조리완료", stateKey: "showReady" },
  ] as const;

  const router = useRouter();
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableOrders, setTableOrders] = useState<OrderItem[][]>([]);
  const [showConfirmPayModal, setShowConfirmPayModal] = useState(false);
  const [showSuccessPayModal, setShowSuccessPayModal] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(true);
  const [tableCount, setTableCount] = useState(0);

  const fetchTableCount = async () => {
    try {
      const count = await getTableNumber();
      setTableCount(count); // <- 숫자 직접 받음
    } catch (err) {
      console.error("테이블 수 가져오기 실패", err);
    }
  };
  useEffect(() => {
    fetchTableCount();
  }, []);

  // 외부 클릭 시 로그아웃 박스 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (logoutRef.current && !logoutRef.current.contains(e.target as Node)) {
        setShowLogoutBox(false);
      }
    };

    if (showLogoutBox) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showLogoutBox]);

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
          ref={logoutRef}
          className="relative rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer"
          onClick={() => setShowLogoutBox((prev) => !prev)}
        >
          <FaRegUserCircle size={22} color="#808080" />
          {showLogoutBox && (
            <div className="absolute top-full right-0 mt-2 w-[120px] bg-white border border-gray-200 shadow-lg rounded-md z-[100] overflow-hidden">
              <button
                className="w-full text-sm text-[#2a2a2a] hover:bg-gray-100 py-2 px-4 text-left"
                onClick={async () => {
                  await logout();
                  setShowLogoutBox(false);
                  router.push("/manage/login");
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
      {showTableModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90vw] max-w-[500px] shadow-xl space-y-4 relative max-h-[95vh] overflow-auto">
            <h2 className="text-lg font-bold text-center">테이블 정산</h2>

            {isTableSelectorOpen && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(tableCount)].map((_, i) => {
                    const tableId = i + 1;
                    const isSelected = selectedTableIds.includes(tableId);
                    return (
                      <div
                        key={tableId}
                        onClick={() =>
                          setSelectedTableIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== tableId)
                              : [...prev, tableId]
                          )
                        }
                        className={`border px-3 py-2 rounded cursor-pointer flex justify-between items-center ${
                          isSelected ? "bg-blue-100 border-blue-500" : ""
                        }`}
                      >
                        <span>{tableId}번</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="w-full mt-4 bg-[#093AEE] text-white py-2 rounded"
                  onClick={async () => {
                    if (selectedTableIds.length === 0) {
                      alert("테이블을 선택하세요.");
                      return;
                    }

                    try {
                      const results = await Promise.all(
                        selectedTableIds.map((id) =>
                          fetchTableOrders(id).catch((err) => {
                            if (err.response?.status === 404) return []; // 주문 없으면 빈 배열 반환
                            throw err; // 다른 에러는 그대로 throw
                          })
                        )
                      );
                      const merged = results.flat();
                      setTableOrders(merged);
                      setIsTableSelectorOpen(false);
                    } catch (err) {
                      console.error("여러 테이블 주문 조회 실패:", err);
                      alert("테이블 조회 실패");
                    }
                  }}
                >
                  조회하기
                </button>
              </div>
            )}

            <button
              onClick={() => setIsTableSelectorOpen((prev) => !prev)}
              className="text-sm underline text-blue-600 mt-2"
            >
              {isTableSelectorOpen ? "테이블 선택 닫기" : "테이블 선택 열기"}
            </button>
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
                  className="px-3 py-2 rounded bg-green-500 text-white text-[12px]"
                  onClick={async () => {
                    try {
                      await addTable();
                      alert("테이블이 추가되었습니다.");
                      await fetchTableCount();
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
                  className="px-3 py-2 rounded bg-red-500 text-white text-[12px]"
                  onClick={async () => {
                    try {
                      await deleteTable();
                      alert("테이블이 삭제되었습니다.");
                      // optional: 리프레시 or 테이블 수 업데이트
                      await fetchTableCount();
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
                  className="px-4 py-2 rounded bg-gray-300 text-[#333] text-[12px]"
                  onClick={() => {
                    setShowTableModal(false);
                    setSelectedTableIds([]);
                    setTableOrders([]);
                    setIsTableSelectorOpen(true);
                  }}
                >
                  닫기
                </button>
                {tableOrders.length > 0 && (
                  <button
                    className="px-4 py-2 rounded bg-blue-500 text-white text-[12px]"
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
              정말 {selectedTableIds.join(", ")}번 테이블을 정산하시겠습니까?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-[#333]"
                onClick={() => {
                  setShowConfirmPayModal(false);
                  setSelectedTableIds([]);
                }}
              >
                취소
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={async () => {
                  try {
                    await Promise.all(
                      selectedTableIds.map((id) => payingTableOrders(id))
                    );
                    setShowConfirmPayModal(false);
                    setShowSuccessPayModal(true);
                    setShowTableModal(false);
                    setCookingUpdated(true);
                    setIsTableSelectorOpen(true);
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
              {selectedTableIds.join(", ")}번 테이블 정산 완료
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => {
                setShowSuccessPayModal(false);
                setSelectedTableIds([]);
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
