"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMenuById } from "@/app/api/fetchMenuAPI";
import { submitMenuUpdate } from "@/app/api/fetchForManagerAPI";

export default function ManagedMenuImage() {
  const { menuId } = useParams();
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const numericMenuId = Number(menuId);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // 1. input ref 추가
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImageUrl(URL.createObjectURL(file)); // 즉시 반영
  };

  const {
    data: menu,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu", numericMenuId],
    queryFn: () => fetchMenuById(numericMenuId),
    enabled: !isNaN(numericMenuId),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (menu) {
      setName(menu.menuName);
      setInfo(menu.menuInfo);
      setPrice(menu.menuPrice);
    }
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const changed =
      name !== menu.menuName ||
      info !== menu.menuInfo ||
      price !== menu.menuPrice ||
      selectedImage !== null; // ✅ 이미지 변경 체크 추가
    setHasChanged(changed);
  }, [name, info, price, menu, selectedImage]); // ✅ selectedImage도 의존성에 추가

  const isStillLoading = isLoading || showSkeleton;

  if (isStillLoading)
    return (
      <div className="fixed inset-0 w-full h-screen flex justify-center items-center bg-white/50 z-50">
        <span className="loader"></span>
      </div>
    );
  if (isError || !menu) return <div>메뉴를 불러오지 못했습니다.</div>;

  return (
    <>
      {/* 📷 이미지 영역 */}
      <div className="relative w-full h-[250px]">
        <Image
          src={previewImageUrl || menu.menuImage || "/DineQLogo.png"}
          alt="메뉴 이미지"
          fill
          className="object-contain"
          priority
        />
        {/* 이미지 업로드 input (숨김 처리) */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />

        <button
          className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          사진 변경
        </button>
      </div>

      {/* ✏️ 수정 가능 영역 */}
      <div className="p-4 pt-6 pb-0 flex flex-col gap-4">
        <input
          className="text-[20px] font-semibold text-[#2a2a2a] border-b border-gray-300 py-1 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="text-sm text-[#5E5E5E] border-b border-gray-300 py-1 outline-none resize-none h-[80px]"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
        <input
          type="number"
          className="text-xl font-bold text-[#2a2a2a] border-b border-gray-300 py-1 outline-none"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      {/* 🔻 구분선 */}
      <div className="bg-[#f0f0f0] w-full h-[4px] mt-4"></div>

      {/* ✅ 변경 버튼 */}
      {hasChanged && (
        <div className="fixed bottom-0 w-full left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between gap-2">
          <button
            className="px-4 py-2 rounded w-[32%] bg-gray-300 text-[#333]"
            onClick={() => {
              setName(menu.menuName);
              setInfo(menu.menuInfo);
              setPrice(menu.menuPrice);
              setHasChanged(false);
            }}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded w-[66%] bg-blue-600 text-white"
            onClick={() => setConfirmModalOpen(true)}
          >
            변경하기
          </button>
        </div>
      )}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-2xl text-center">
            <p className="font-bold text-[#2a2a2a] mb-4">
              정말 변경하시겠습니까?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setConfirmModalOpen(false)}
              >
                취소
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    await submitMenuUpdate(
                      numericMenuId,
                      {
                        menuName: name,
                        menuPrice: Number(price),
                        menuInfo: info,
                        categoryId: menu.categoryId, // 기존 카테고리 유지
                      },
                      selectedImage ?? undefined
                    );

                    alert("메뉴가 성공적으로 수정되었습니다.");
                    setConfirmModalOpen(false);
                    setHasChanged(false);
                    router.push("/manage"); // 성공 후 이동 처리
                  } catch (error) {
                    alert("저장 중 오류가 발생했습니다.");
                    console.error(error);
                  }
                }}
              >
                보내기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
