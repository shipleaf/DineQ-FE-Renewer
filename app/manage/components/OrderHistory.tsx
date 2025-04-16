import React from 'react'
import { FaRegClock } from 'react-icons/fa'

export default function OrderHistory() {
  return (
    <div className="min-h-[75vh] w-[23%] border-2 border-[#f0f0f0] rounded-[10px] p-4">
      <div>
        <div className="flex items-center gap-1">
          <div className="bg-[#FC0176] w-[24px] h-[24px] flex items-center justify-center rounded-full">
            <FaRegClock color="white" size={18} />
          </div>
          <span className="font-[700] text-[#2a2a2a] text-sm">주문처리중</span>
        </div>
        <button></button>
      </div>
    </div>
  )
}
