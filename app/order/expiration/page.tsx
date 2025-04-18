import React from "react";

export default function page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center p-6">
      <h1 className="text-2xl font-bold text-[#2a2a2a] mb-4">유효하지 않은 접속입니다</h1>
      <p className="text-[#666] text-base">
        테이블 인증에 실패했습니다.
        <br />
        <span className="font-medium text-[#093AEE]">QR 코드를 다시 인식</span>해 주세요.
      </p>
    </div>
  );
}