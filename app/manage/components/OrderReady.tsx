import React from "react";
import { PiCookingPotBold } from "react-icons/pi";

export default function OrderReady() {
  return (
    <div className="h-[90vh] border-2 w-[32%] border-[#f0f0f0] rounded-[10px] p-4">
      <div>
        <div className="flex items-center gap-1">
          <div className="bg-[#8B8BE1] w-[24px] h-[24px] flex items-center justify-center rounded-full">
            <PiCookingPotBold color="white" size={18} />
          </div>
          <span className="font-[700] text-[#2a2a2a] text-sm">조리완료</span>
        </div>
        <button></button>
      </div>
    </div>
  );
}