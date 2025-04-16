"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { useCartStore } from "@/store/cartStore";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMenuById } from "@/app/api/fetchMenuAPI";

export default function MenuImage() {
  const { menuId } = useParams();
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);

  const numericMenuId = Number(menuId);

  const {
    data: menu,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu", numericMenuId],
    queryFn: () => fetchMenuById(numericMenuId),
    enabled: !isNaN(numericMenuId), // menuId가 숫자로 변환 가능한 경우에만 실행
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const isStillLoading = isLoading || showSkeleton;

  const [multiplier, setMultiplier] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const increase = () => setMultiplier((prev) => prev + 1);
  const decrease = () => multiplier > 1 && setMultiplier((prev) => prev - 1);

  if (isStillLoading)
    return (
      <div className="fixed inset-0 w-[100vw] h-[100vh] flex top-[45%] justify-center z-[100] bg-white/50">
        <span className="loader"></span>
      </div>
    );
  if (isError || !menu) return <div>메뉴를 불러오지 못했습니다.</div>;

  return (
    <>
      {isError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110]">
          <div className="bg-white rounded-xl p-6 w-[90vw] max-w-md shadow-xl text-center space-y-4">
            <h2 className="text-lg font-bold text-[#2a2a2a]">
              메뉴 불러오기 실패
            </h2>
            <p className="text-sm text-[#666]">
              메뉴를 불러오는데 실패했습니다.
            </p>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => router.push("/order")}
            >
              새로고침
            </button>
          </div>
        </div>
      )}
      <div className="relative w-full h-[250px] flex flex-col">
        <Image
          src={menu.menuImage || "/DineQLogo.png"}
          alt="메뉴 이미지"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-4 pt-6 pb-0 flex flex-col gap-2">
        <span className="font-[600] text-[20px] text-[#2a2a2a]">
          {menu.menuName}
        </span>
        <span className="font-[400] text-[14px] text-[#5E5E5E]">
          {menu.menuInfo}
        </span>
        <div className="mt-4 text-[24px] font-semibold text-[#2a2a2a] flex items-center justify-between">
          {menu.menuPrice.toLocaleString()}원
          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={decrease}
              disabled={multiplier === 1}
              className={`p-2 rounded text-lg ${
                multiplier === 1
                  ? "bg-gray-100 text-white"
                  : "bg-gray-200 text-[#5E5E5E]"
              }`}
            >
              <FaMinus size={20} />
            </button>
            <div className="text-[16px] w-[40px] text-center">
              {multiplier}개
            </div>
            <button
              onClick={increase}
              className="p-2 rounded text-lg bg-gray-200 text-[#5E5E5E]"
            >
              <FaPlus size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="fixed w-full p-4 bottom-0">
        <button
          className="bg-[#35CAF4] text-white w-full p-4 rounded-[10px]"
          onClick={() => {
            addToCart({
              menuId: menu.menuId,
              name: menu.menuName,
              price: menu.menuPrice,
              quantity: multiplier,
              image: menu.menuImage,
            });
            router.back();
          }}
        >
          {(menu.menuPrice * multiplier).toLocaleString()}원 장바구니 담기
        </button>
      </div>
      <div className="bg-[#f0f0f0] w-full h-[4px] mt-4"></div>
    </>
  );
}
