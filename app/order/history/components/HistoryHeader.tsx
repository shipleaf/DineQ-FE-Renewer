"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function HistoryHeader() {
  const router = useRouter();
  return (
    <div>
      <div className="p-4 py-6 grid grid-cols-5 items-center">
        <button onClick={() => router.back()}>
          <FaArrowLeft color="#2a2a2a" size={20} />
        </button>
        <span className="text-lg font-bold col-span-3 text-center text-[#2a2a2a]">
          주문내역
        </span>
        <div></div>
      </div>
      <div className="bg-[#f0f0f0] h-[2px] w-full"></div>
    </div>
  );
}