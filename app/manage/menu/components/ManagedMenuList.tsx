"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAllMenus } from "@/app/api/fetchMenuAPI";
import { useQuery } from "@tanstack/react-query";
import { FaPencilAlt } from "react-icons/fa";
import { updateCategoryName } from "@/app/api/fetchForManagerAPI";

type Menu = {
  categoryId: number;
  categoryName: string;
  categoryPriority: number;
  menuId: number;
  menuName: string;
  menuPrice: number;
  imageUrl: string | null;
  onSale: boolean;
  menuImage: string;
};

export default function ManagedMenuList() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchAllMenus,
    retry: 2,
  });

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const Menu: Menu[] = data ?? [];

  const Category = Menu.reduce((acc: Record<string, number>, cur) => {
    if (!acc[cur.categoryName]) {
      acc[cur.categoryName] = cur.categoryId;
    }
    return acc;
  }, {});

  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const router = useRouter();
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const skipObserverRef = useRef(false);

  const [confirmModalData, setConfirmModalData] = useState<{
    id: number;
    oldName: string;
    newName: string;
  } | null>(null);

  const scrollToCategory = (categoryId: number) => {
    const targetElement = categoryRefs.current[categoryId];
    const buttonElement = buttonRefs.current[categoryId];
    const stickyHeader = document.querySelector(".sticky-header");

    if (targetElement) {
      const headerHeight = stickyHeader ? stickyHeader.clientHeight : 80;
      const offset =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      skipObserverRef.current = true;
      setTimeout(() => {
        skipObserverRef.current = false;
      }, 300);

      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveCategory(categoryId);

      // 직접 스크롤로 버튼 영역 옮기기 (scrollLeft 계산 방식)
      if (buttonElement?.offsetLeft !== undefined) {
        buttonElement.parentElement?.scrollTo({
          left: buttonElement.offsetLeft - 8, // 여유 padding
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight =
        document.querySelector(".sticky-header")?.clientHeight || 80;
      const scrollTop = window.scrollY + headerHeight + 1;

      let currentCategory: number | null = null;

      Object.entries(categoryRefs.current).forEach(([id, el]) => {
        if (el) {
          const top = el.offsetTop;
          if (scrollTop >= top) {
            currentCategory = Number(id);
          }
        }
      });

      if (currentCategory !== null && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);

        const button = buttonRefs.current[currentCategory];
        if (button?.offsetLeft !== undefined) {
          button.parentElement?.scrollTo({
            left: button.offsetLeft - 8,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  const isStillLoading = isLoading || showSkeleton;

  return (
    <div>
      {isError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110]">
          <div className="bg-white rounded-xl p-6 w-[90vw] max-w-md shadow-xl text-center space-y-4">
            <h2 className="text-lg font-bold text-[#2a2a2a]">
              데이터 로드 실패
            </h2>
            <p className="text-sm text-[#666]">
              문제가 발생했습니다.
              <br />
              새로고침 후 다시 시도해주세요.
            </p>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        </div>
      )}
      {isStillLoading && (
        <div className="fixed inset-0 w-[100vw] h-[100vh] flex top-[45%] justify-center z-[100] bg-white/50">
          <span className="loader"></span>
        </div>
      )}

      <div className="category sticky top-0 z-0 bg-white h-[80px] sticky-header p-4">
        {isStillLoading ? (
          ""
        ) : (
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {Object.entries(Category).map(([name, id]) => (
              <button
                key={id}
                ref={(el) => void (buttonRefs.current[id] = el)}
                onClick={() => scrollToCategory(id)}
                className={`px-4 py-2 text-sm font-bold rounded-[999px] w-fit snap-start ${
                  activeCategory === id
                    ? "bg-blue-700 text-white"
                    : "bg-white text-[#2a2a2a] border-1 border-[#f0f0f0]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 메뉴 리스트 */}
      <div className="space-y-8 pt-4">
        {isStillLoading
          ? // 🔹 하드코딩된 스켈레톤 UI
            [1, 2].map((cat) => (
              <div key={`skeleton-category-${cat}`}>
                <div className="px-4 pb-2">
                  <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={`skeleton-menu-${cat}-${i}`}>
                      <div className="p-6 bg-white flex justify-between items-start animate-pulse">
                        <div className="space-y-2">
                          <div className="h-5 w-40 bg-gray-200 rounded" />
                          <div className="h-4 w-20 bg-gray-200 rounded" />
                        </div>
                        <div className="w-[140px] h-[100px] rounded-[10px] bg-gray-200" />
                      </div>
                      <div className="bg-[#F0F0F0] h-[2px]" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          : Object.entries(Category).map(([name, id]) => {
              const menus = Menu.filter((m) => m.categoryId === id);
              const isEditing = editingCategoryId === id;
              return (
                <div key={id}>
                  <div
                    ref={(el) => void (categoryRefs.current[id] = el)}
                    className="px-4 pb-2 flex items-center gap-2"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-4 min-h-[36px]">
                        <input
                          value={editedCategoryName}
                          onChange={(e) =>
                            setEditedCategoryName(e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 font-bold text-xl h-[36px] leading-none"
                        />
                        <button
                          onClick={() =>
                            setConfirmModalData({
                              id,
                              oldName: name,
                              newName: editedCategoryName,
                            })
                          }
                          className="text-blue-500 text-sm font-semibold"
                        >
                          확인
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategoryId(null);
                            setEditedCategoryName("");
                          }}
                          className="text-gray-500 text-sm font-semibold"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-h-[36px]">
                        <h2 className="text-xl font-bold h-[36px] flex items-center">
                          {name}
                        </h2>
                        <button
                          onClick={() => {
                            setEditingCategoryId(id);
                            setEditedCategoryName(name);
                          }}
                          className="text-gray-500"
                          title="카테고리 이름 수정"
                        >
                          <FaPencilAlt size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {menus.map((menu) => (
                      <div
                        key={menu.menuId}
                        onClick={() =>
                          router.push(`/manage/menu/${menu.menuId}`)
                        }
                      >
                        <div className="p-6 bg-white flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">
                              {menu.menuName}
                            </h3>
                            <p className="text-sm font-semibold">
                              {menu.menuPrice?.toLocaleString()}원
                            </p>
                          </div>
                          <div className="w-[140px] h-[100px] rounded-[10px] overflow-hidden flex items-center justify-center">
                            <Image
                              src={menu.menuImage || "/DineQLogo.png"}
                              alt=""
                              width={140}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="bg-[#F0F0F0] h-[2px]" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 w-[300px] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#2a2a2a] font-bold mb-2">수정 실패</p>
            <p className="text-sm text-[#666]">
              카테고리 이름 수정 중 문제가 발생했습니다.
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => setShowErrorModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
      {confirmModalData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] shadow-2xl text-center">
            <h2 className="text-base font-bold text-[#2a2a2a] mb-4">
              정말 {confirmModalData.oldName}을(를) {confirmModalData.newName}로 변경하시겠습니까?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-[#2a2a2a] font-semibold rounded"
                onClick={() => setConfirmModalData(null)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded"
                onClick={async () => {
                  try {
                    await updateCategoryName(
                      confirmModalData.id,
                      confirmModalData.newName
                    );
                    setConfirmModalData(null);
                    setEditingCategoryId(null);
                    setEditedCategoryName("");
                    refetch();
                  } catch {
                    setConfirmModalData(null);
                    setShowErrorModal(true);
                  }
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
