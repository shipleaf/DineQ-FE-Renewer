"use client";

import React from "react";
// import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
// import { fetchToken } from "../api/fetchToken";
// 
export default function Header() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");

  // const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const getToken = async () => {
  //     try {
  //       const response = await fetchToken();
  //       setToken(response.data.qrToken); // 응답 구조에 맞게 수정
  //     } catch (error) {
  //       console.log("❌ fetchToken error:", error);
  //     }
  //   };

  //   getToken();
  // }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center h-full">
            <Image src="/image.png" alt="" width={32} height={32} />
            <span className="font-[700] text-sm text-[#4E4868]">DineQ</span>
          </div>
          <div className="flex items-center gap-2 h-full">
            <Image src="/whale.png" alt="" width={32} height={24} />
            <span className="font-[700] text-lg text-[#2a2a2a]">
              술고래 조치원점
            </span>
          </div>
        </div>
        <div className="bg-[#D7F4F8] rounded-[10px] flex flex-col items-center text-[#093AEE] font-[700] px-4 py-3 leading-none gap-1 h-full">
          <span className="text-[14px]">테이블</span>
          <span className="text-[20px]">{tableId}번</span>
        </div>
      </div>
      <div className="bg-[#F0F0F0] h-3"></div>
    </div>
  );
}
