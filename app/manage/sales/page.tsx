"use client";

import React, { useEffect, useState } from "react";
import {
  fetchSalesHistory,
  fetchTotalSales,
} from "@/app/api/fetchForManagerAPI"; // fetch 함수 위치에 맞게 수정
import SalesHeader from "./components/SalesHeader";

type SalesItem = {
  menuName: string;
  totalSold: number;
  totalRevenue: number;
};

export default function SalesHistoryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salesData, setSalesData] = useState<SalesItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalRevenue, setTotalRevenue] = useState<{
    totalSales: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleFetch = async () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택하세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [data, total] = await Promise.all([
        fetchSalesHistory(new Date(startDate), new Date(endDate)),
        fetchTotalSales(new Date(startDate), new Date(endDate)),
      ]);
      setSalesData(data);
      setTotalRevenue(total);
      setLoading(false);
      // console.log(totalRevenue)
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind 기준 sm 이하
    };

    checkMobile(); // 처음에도 체크
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <>
      <SalesHeader />
      <div className="max-w-3xl mx-auto p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 ">메뉴별 매출 조회</h2>
        {isMobile ? (
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">시작 날짜</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">종료 날짜</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={handleFetch}
              className="bg-[#093AEE] text-white px-4 py-2 rounded mt-5"
            >
              조회하기
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">시작 날짜</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">종료 날짜</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded px-3 py-2"
              />
            </div>
            <button
              onClick={handleFetch}
              className="bg-[#093AEE] text-white px-4 py-2 rounded mt-5"
            >
              조회하기
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 w-[100vw] h-[100vh] flex top-[45%] justify-center z-[100] bg-white/50">
            <span className="loader"></span>
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {salesData && salesData.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-4">
              {salesData.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">{item.menuName}</p>
                    <p className="text-sm text-gray-600">
                      판매량: {item.totalSold}개
                    </p>
                  </div>
                  <p className="font-bold text-[#093AEE]">
                    {item.totalRevenue.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
            <hr className="border-[#f0f0f0]" />
            <div className="flex items-center justify-between px-4">
              <span>총합</span>
              <span className="text-[#093AEE]">
                {totalRevenue !== null
                  ? `${totalRevenue.totalSales.toLocaleString()}원`
                  : "-"}
              </span>
            </div>
          </div>
        ) : salesData && salesData.length === 0 ? (
          <p className="text-center text-gray-500">조회된 데이터가 없습니다.</p>
        ) : null}
      </div>
    </>
  );
}
