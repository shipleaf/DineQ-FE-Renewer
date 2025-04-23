"use client";

import { useOrderFilterStore } from "@/store/manageStore";
import Image from "next/image";
import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import { useRouter } from "next/navigation";

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
          onClick={() => {router.push("/manage/menu")}}
        >
          메뉴관리
        </button>
        <div className="rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer">
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
    </div>
  );
}
