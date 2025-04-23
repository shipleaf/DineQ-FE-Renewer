"use client";

import {
  CategoryPriorityPayload,
  fetchCatergories,
  submitCategorySort,
} from "@/app/api/fetchForManagerAPI";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
// import { useRouter } from "next/navigation";

import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";

type Category = {
  categoryId: number;
  categoryName: string;
  categoryDesc: string;
  categoryPriority: number;
};

export default function MenuHeader() {
  // const router = useRouter();
  const [showLogoutBox, setShowLogoutBox] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCatergories();
        const sorted = [...data].sort(
          (a, b) => a.categoryPriority - b.categoryPriority
        );
        setCategories(sorted);
      } catch (error) {
        console.error("카테고리 불러오기 실패", error);
      }
    };
    loadCategories();
  }, []);

  function moveItem(index: number, direction: "up" | "down") {
    setCategories((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

      // 스왑
      [newArr[index], newArr[targetIndex]] = [
        newArr[targetIndex],
        newArr[index],
      ];
      return newArr.map((item, idx) => ({
        ...item,
        categoryPriority: idx + 1,
      }));
    });
  }

  const submitCategoryOrder = async () => {
    const payload: CategoryPriorityPayload = {
      priorities: categories.map((c, index) => ({
        categoryId: c.categoryId,
        categoryPriority: index + 1,
      })),
    };

    try {
      await submitCategorySort(payload);
      alert("카테고리 정렬이 저장되었습니다.");
      setShowCategoryModal(false);
    } catch (err) {
      console.error("정렬 저장 실패", err);
      alert("저장 실패");
    }
  };

  return (
    <div className="grid grid-cols-5 items-center justify-between p-4">
      <div className="flex items-center">
        <Image src="/image.png" alt="" width={48} height={24} />
        <span className="font-[700] text-[#4E4868] text-[24px]">DineQ</span>
      </div>
      <div className="flex items-center justify-center gap-4 col-span-3 text-[#4E4868] font-[700] text-md"></div>
      <div className="flex items-center justify-end gap-3">
        <div
          className="rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer"
          onClick={() => setShowCategoryModal(true)}
        >
          카테고리
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
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">
              카테고리 정렬
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map((cat, i) => (
                <div
                  key={cat.categoryId}
                  className="flex items-center justify-between py-2"
                >
                  <span>{cat.categoryName}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveItem(i, "up")}>
                      <IoIosArrowDropupCircle size={32} color="#c0c0c0" />
                    </button>
                    <button onClick={() => moveItem(i, "down")}>
                      <IoIosArrowDropdownCircle size={32} color="#c0c0c0" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setShowCategoryModal(false)}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={submitCategoryOrder}
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
