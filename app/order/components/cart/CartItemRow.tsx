import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import type { CartItem } from "@/app/type/cart/cart";

type CartItemRowProps = {
  item: CartItem;
  onUpdateQuantity: (menuId: number, quantity: number) => void;
  onRemove: (menuId: number) => void;
};

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-[#2a2a2a] text-[16px]">
          {item.name}
        </span>
        <span className="text-sm text-[#666]">
          {item.quantity}개 / {item.totalPrice.toLocaleString()}원
        </span>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              if (item.quantity > 1) {
                onUpdateQuantity(item.menuId, item.quantity - 1);
              } else {
                alert("1개 이하로 줄일 수 없어요. 상품을 삭제합니다.");
                onRemove(item.menuId);
              }
            }}
            disabled={item.quantity === 1}
            className={`p-2 rounded text-[16px] font-bold
    ${
      item.quantity === 1
        ? "bg-[#e0e0e0] text-white cursor-not-allowed"
        : "bg-[#e0e0e0] text-[#5E5E5E]"
    }
  `}
          >
            <FaMinus size={12} />
          </button>

          <span className="min-w-[24px] text-center">{item.quantity}</span>

          <button
            onClick={() => onUpdateQuantity(item.menuId, item.quantity + 1)}
            className="p-2 bg-[#e0e0e0] rounded text-[16px] font-bold"
          >
            <FaPlus size={12} />
          </button>
          <button
            onClick={() => {
              const isConfirmed = confirm("해당 상품을 장바구니에서 삭제할까요?");
              if (isConfirmed) {
                onRemove(item.menuId);
              }
            }}
            className="ml-2 text-[#666]"
            title="삭제"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>
      <Image
        src={item.image || "/DineQLogo.png"}
        alt={`${item.name} 이미지`}
        width={80}
        height={60}
        className="rounded-[10px] object-cover"
      />
    </div>
  );
}
