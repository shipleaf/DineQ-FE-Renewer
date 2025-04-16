"use client";

import React, { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-[#f7f7f7] h-[35vh] p-4 flex flex-col gap-1">
      <span className="text-sm font-[500] text-[#2a2a2a]">유의사항</span>
      <div>
        <span className="text-[13px] font-[400] text-[#4f4f4f]">
          &#8226; 메뉴 사진은 연출된 이미지로 실제 조리된 음식과 차이가 있을 수
          있습니다.
        </span>
      </div>
    </div>
  );
}
