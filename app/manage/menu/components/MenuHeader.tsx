"use client";

import {
  createNewCategory,
  fetchCatergories,
  submitCategorySort,
  submitNewMenu,
  updateMenuPriority,
} from "@/app/api/fetchForManagerAPI";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { logout } from "@/app/api/useLoginAPI";
type Category = {
  categoryId: number;
  categoryName: string;
  categoryDesc: string;
  categoryPriority: number;
};

type ModalType =
  | "none"
  | "menu-add"
  | "menu-sort"
  | "category-add"
  | "category-sort";

// const defaultPreviewImage = "/DineQLogo.png";

type Menu = {
  menuId: number;
  menuName: string;
  menuPriority: number;
  categoryId: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function MenuHeader() {
  const router = useRouter();
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [menuName, setMenuName] = useState("");
  const [menuInfo, setMenuInfo] = useState("");
  const [menuPrice, setMenuPrice] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [menuSortCategoryId, setMenuSortCategoryId] = useState<number | "">("");
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [showConfirmSortModal, setShowConfirmSortModal] = useState(false);
  const [showSuccessSortModal, setShowSuccessSortModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [showConfirmCategoryModal, setShowConfirmCategoryModal] =
    useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  function moveMenuItem(index: number, direction: "up" | "down") {
    setMenuList((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
  
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
  
      // priority 값만 서로 교환
      const tempPriority = newArr[index].menuPriority;
      newArr[index].menuPriority = newArr[targetIndex].menuPriority;
      newArr[targetIndex].menuPriority = tempPriority;
  
      // 배열 순서 자체는 유지 (swap 안함)
      return newArr;
    });
  }

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

  useEffect(() => {
    if (activeModal === "category-sort" || "menu-add") {
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
    }
  }, [activeModal]);

  function moveItem(index: number, direction: "up" | "down") {
    setCategories((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
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
    const payload = {
      priorities: categories.map((c, index) => ({
        categoryId: c.categoryId,
        categoryPriority: index + 1,
      })),
    };
    
    try {
      await submitCategorySort(payload);
      alert("카테고리 정렬이 저장되었습니다.");
      setActiveModal("none");
      location.reload();
    } catch (err) {
      console.error("정렬 저장 실패", err);
      alert("저장 실패");
    }
  };

  const handleSubmitNewMenu = async () => {
    if (!menuName || !menuPrice || !selectedCategoryId) {
      setShowErrorModal(true);
      return;
    }

    try {
      await submitNewMenu(
        {
          menuName,
          menuInfo,
          menuPrice: Number(menuPrice),
          categoryId: Number(selectedCategoryId),
          onSale: true,
        },
        imageFile ?? undefined
      );

      alert("메뉴가 등록되었습니다.");
      setActiveModal("none");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  const handleSubmitMenuSort = async () => {
    const payload = {
      priorities: menuList.map((menu) => ({
        menuId: menu.menuId,
        menuPriority: menu.menuPriority,
      })),
    };

    try {
      await updateMenuPriority(payload);
      setShowConfirmSortModal(false);
      setShowSuccessSortModal(true);
      location.reload();
    } catch (err) {
      console.error("메뉴 정렬 저장 실패", err);
      alert("정렬 저장 실패");
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 items-center justify-between p-4 relative">
        <div
          className="flex items-center gap-2"
          onClick={() => router.push("/manage")}
        >
          <button
            className="p-1"
            onClick={(e) => {
              setShowSidebar(true);
              e.stopPropagation();
            }}
          >
            <FiMenu size={24} />
          </button>
          <Image src="/image.png" alt="" width={48} height={24} />
          <span className="font-bold text-[#4E4868] text-[24px]">DineQ</span>
        </div>

        <div className="flex items-center justify-end gap-3 col-span-4">
          <div className="rounded-[10px] border w-[36px] h-[36px] flex items-center justify-center border-[#c0c0c0] cursor-pointer">
            <BsGear size={20} color="#808080" />
          </div>
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
      {/* Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <div
        className={`
      fixed left-0 top-0 z-50 h-full w-[70vw] bg-white shadow-lg p-6 space-y-4
      transform transition-transform duration-300 ease-in-out
      ${showSidebar ? "translate-x-0" : "-translate-x-full"}
    `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-start">
          <h2 className="font-bold text-lg text-[#2a2a2a] mb-2">메뉴</h2>
          <button
            onClick={() => {
              setActiveModal("menu-add");
              setShowSidebar(false);
            }}
            className="text-[#808080]"
          >
            - 메뉴 추가
          </button>
          <button
            onClick={() => {
              setActiveModal("menu-sort");
              setShowSidebar(false);
            }}
            className="text-[#808080]"
          >
            - 메뉴 정렬
          </button>
        </div>
        <hr />
        <div className="flex flex-col items-start">
          <h2 className="font-bold text-lg text-[#2a2a2a] mb-2">카테고리</h2>
          <button
            onClick={() => {
              setActiveModal("category-add");
              setShowSidebar(false);
            }}
            className="text-[#808080]"
          >
            - 카테고리 추가
          </button>
          <button
            onClick={() => {
              setActiveModal("category-sort");
              setShowSidebar(false);
            }}
            className="text-[#808080]"
          >
            - 카테고리 정렬
          </button>
        </div>
      </div>
      {/* ✅ Category Sort Modal */}
      {activeModal === "category-sort" && (
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
                onClick={() => setActiveModal("none")}
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
      {activeModal === "menu-add" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl min-w-[50%] min-h-[60vh] max-h-[90vh] overflow-y-auto shadow-lg space-y-4 relative">
            <h2 className="text-lg font-bold text-center">메뉴 추가</h2>

            <div>
              <label className="block mb-1 text-sm font-bold">카테고리</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
                <option value="">카테고리 선택</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">
                메뉴 이름
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">
                메뉴 설명
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 resize-none h-[80px]"
                value={menuInfo}
                onChange={(e) => setMenuInfo(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">가격</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={menuPrice}
                onChange={(e) => setMenuPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold">사진</label>
              <div className="flex items-center gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => fileInputRef.current?.click()}
                >
                  사진 업로드
                </button>

                {/* 미리보기 + 삭제 버튼 */}
                {imageFile && previewImageUrl && (
                  <div className="relative">
                    <Image
                      src={previewImageUrl}
                      alt="미리보기"
                      width={120}
                      height={60}
                      className="rounded object-cover"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setPreviewImageUrl(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewImageUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setActiveModal("none")}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitNewMenu}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[300px] shadow-2xl text-center">
            <p className="text-[#2a2a2a] font-bold mb-2">입력 오류</p>
            <p className="text-sm text-[#666]">모든 필드를 입력해주세요.</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => setShowErrorModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
      {activeModal === "menu-sort" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl min-w-[60vw] max-h-[80vh] overflow-y-auto shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-center">메뉴 정렬</h2>
            <div>
              <label className="block mb-1 text-sm font-semibold">
                카테고리 선택
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={menuSortCategoryId}
                onChange={async (e) => {
                  const categoryId = Number(e.target.value);
                  setMenuSortCategoryId(categoryId);

                  try {
                    const res = await fetch(`${apiUrl}/api/v1/store/menus`, {
                      credentials: "include",
                    });
                    const data = await res.json();
                    const filtered = data
                      .filter((menu: Menu) => menu.categoryId === categoryId)
                      .sort(
                        (a: Menu, b: Menu) => a.menuPriority - b.menuPriority
                      );
                    setMenuList(filtered);
                  } catch (err) {
                    console.error("메뉴 불러오기 실패", err);
                  }
                }}
              >
                <option value="">카테고리 선택</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              {menuList.map((menu, i) => (
                <div
                  key={menu.menuId}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <span>{menu.menuName}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveMenuItem(i, "up")}>
                      {" "}
                      <IoIosArrowDropupCircle size={24} color="#c0c0c0" />{" "}
                    </button>
                    <button onClick={() => moveMenuItem(i, "down")}>
                      {" "}
                      <IoIosArrowDropdownCircle
                        size={24}
                        color="#c0c0c0"
                      />{" "}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setActiveModal("none")}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmSortModal(true)}
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ 확인 모달 */}
      {showConfirmSortModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-xl text-center">
            <p className="text-[#2a2a2a] font-bold mb-2">정렬 확인</p>
            <p className="text-sm text-[#666]">정말 이대로 저장할까요?</p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-[#333]"
                onClick={() => setShowConfirmSortModal(false)}
              >
                취소
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={handleSubmitMenuSort}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ 완료 모달 */}
      {showSuccessSortModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-xl text-center">
            <p className="text-green-600 font-bold mb-2">
              정렬이 저장되었습니다.
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => {
                setShowSuccessSortModal(false);
                setActiveModal("none");
                location.reload(); // ✅ 페이지 새로고침
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}{" "}
      {activeModal === "category-add" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[360px] shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-center">카테고리 추가</h2>
            <div>
              <label className="text-sm font-semibold">카테고리 이름</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">카테고리 설명</label>
              <textarea
                className="w-full border rounded px-3 py-2 mt-1 resize-none h-[80px]"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setActiveModal("none")}
              >
                취소
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (!newCategoryName) {
                    alert("카테고리명을 입력해주세요.");
                    return;
                  }
                  setShowConfirmCategoryModal(true);
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmCategoryModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-xl text-center">
            <p className="text-[#2a2a2a] font-bold mb-2">카테고리 추가</p>
            <p className="text-sm text-[#666]">정말 이대로 추가할까요?</p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-[#333]"
                onClick={() => setShowConfirmCategoryModal(false)}
              >
                취소
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={async () => {
                  try {
                    await createNewCategory({
                      categoryName: newCategoryName,
                      categoryDesc: newCategoryDesc,
                    });

                    setShowConfirmCategoryModal(false);
                    setActiveModal("none");
                    setNewCategoryName("");
                    setNewCategoryDesc("");
                    location.reload();
                  } catch (err) {
                    console.error("카테고리 추가 실패", err);
                    alert("추가 실패");
                  }
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
