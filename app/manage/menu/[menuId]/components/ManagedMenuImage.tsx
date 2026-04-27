"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMenuById } from "@/app/api/fetchMenuAPI";
import {
  deleteMenu,
  submitMenuUpdate,
  updateMenuStatus,
} from "@/app/api/fetchForManagerAPI";
import { resizeImageFile } from "@/app/utils/resizeImageFile";

export default function ManagedMenuImage() {
  const { menuId } = useParams();
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const numericMenuId = Number(menuId);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isResizingImage, setIsResizingImage] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    success: boolean;
    message: string;
  }>({ open: false, success: true, message: "" });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [onSale, setOnSale] = useState(true);
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);

  // 1. input ref 추가
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. 이미지 선택 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsResizingImage(true);
    try {
      const resizedFile = await resizeImageFile(file);
      setSelectedImage(resizedFile);
      setPreviewImageUrl(URL.createObjectURL(resizedFile)); // 즉시 반영
    } catch (error) {
      console.error("이미지 리사이즈 실패", error);
      setSelectedImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    } finally {
      setIsResizingImage(false);
    }
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

  useEffect(() => {
    return () => {
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    };
  }, [previewImageUrl]);

  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (menu) {
      setName(menu.menuName);
      setInfo(menu.menuInfo);
      setPrice(menu.menuPrice);
      setOnSale(menu.onSale); // ✅ 초기 상태
    }
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const changed =
      name !== menu.menuName ||
      info !== menu.menuInfo ||
      price !== menu.menuPrice ||
      selectedImage !== null; // ✅ onSale 조건 제거
    setHasChanged(changed);
  }, [name, info, price, selectedImage, menu]); // ✅ onSale도 의존성에서 제거

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
          disabled={isResizingImage}
          onClick={() => fileInputRef.current?.click()}
        >
          {isResizingImage ? "처리 중..." : "사진 변경"}
        </button>
      </div>

      {/* ✏️ 수정 가능 영역 */}
      <div className="p-4 pt-6 pb-0 flex flex-col gap-4">
        <div className="flex items-center border-b border-gray-300">
          <input
            className="flex-1 text-[20px] font-semibold text-[#2a2a2a] py-1 outline-none min-w-0"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-center gap-4 ml-4 flex-shrink-0">
            {/* ✅ 상태 토글 버튼 */}
            <div
              className={`flex items-center border rounded-full px-3 py-1 cursor-pointer text-sm font-medium ${
                onSale
                  ? "bg-blue-100 text-blue-700 border-blue-500"
                  : "bg-red-100 text-red-600 border-red-500"
              }`}
              onClick={() => setConfirmStatusModal(true)}
            >
              {onSale ? "판매중" : "품절"}
            </div>
            <button
              className="font-[700] text-[#ff0000]"
              onClick={() => setDeleteModalOpen(true)}
            >
              메뉴삭제
            </button>
          </div>
        </div>
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
              setSelectedImage(null);
              setPreviewImageUrl(null);
              setHasChanged(false);
            }}
          >
            취소
          </button>
          <button
            className={`px-4 py-2 rounded w-[66%] text-white ${
              isResizingImage ? "bg-blue-300" : "bg-blue-600"
            }`}
            disabled={isResizingImage}
            onClick={() => setConfirmModalOpen(true)}
          >
            {isResizingImage ? "이미지 처리 중..." : "변경하기"}
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
                    router.push("/manage/menu");
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
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[320px] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span>정말 삭제하시겠습니까?</span>
            <div>
              <button></button>
              <button></button>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[320px] shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#2a2a2a] font-bold mb-2">
              정말 삭제하시겠습니까?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-[#333]"
                onClick={() => setDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className="bg-red-600 px-4 py-2 rounded text-white"
                onClick={async () => {
                  try {
                    await deleteMenu(Number(menuId!));
                    setDeleteModalOpen(false);
                    setFeedbackModal({
                      open: true,
                      success: true,
                      message: "메뉴가 삭제되었습니다.",
                    });
                  } catch (err) {
                    console.error("삭제 실패", err);
                    setFeedbackModal({
                      open: true,
                      success: false,
                      message: "삭제 중 오류가 발생했습니다.",
                    });
                  }
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-2xl text-center">
            <p
              className={`font-bold mb-2 ${
                feedbackModal.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedbackModal.message}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              onClick={() => {
                setFeedbackModal({ ...feedbackModal, open: false });
                router.push("/manage/menu");
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
      {confirmStatusModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] shadow-2xl text-center">
            <p className="text-[#2a2a2a] font-bold mb-2">상태 변경</p>
            <p className="text-sm text-[#666]">
              정말 {onSale ? "품절 처리" : "판매중 전환"}하시겠습니까?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-[#333]"
                onClick={() => setConfirmStatusModal(false)}
              >
                취소
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={async () => {
                  try {
                    await updateMenuStatus(Number(menuId), !onSale);
                    setOnSale((prev) => !prev);
                    setConfirmStatusModal(false);
                  } catch (err) {
                    console.error("상태 변경 실패", err);
                    alert("상태 변경에 실패했습니다.");
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
