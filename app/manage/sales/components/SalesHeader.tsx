"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";
import { logout } from "@/app/api/useLoginAPI";

export default function SalesHeader() {
  const logoutRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showLogoutBox, setShowLogoutBox] = useState(false);

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
    <>
      <div className="grid grid-cols-5 items-center justify-between p-4 relative">
        <div
          className="flex items-center gap-2"
          onClick={() => router.push("/manage")}
        >
          <Image src="/image.png" alt="" width={48} height={24} />
          <span className="font-bold text-[#4E4868] text-[24px]">DineQ</span>
        </div>

        <div className="flex items-center justify-end gap-3 col-span-4">
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
      </div>
    </>
  );
}
