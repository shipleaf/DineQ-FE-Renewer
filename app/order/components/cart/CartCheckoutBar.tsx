type CartCheckoutBarProps = {
  totalPrice: number;
  cartCount: number;
  onCheckout: () => void;
};

export default function CartCheckoutBar({
  totalPrice,
  cartCount,
  onCheckout,
}: CartCheckoutBarProps) {
  return (
    <>
      <div className="pb-4 flex flex-col gap-2 mb-12">
        <div className="h-[2px] bg-[#f0f0f0] mb-2"></div>
        <div className="flex justify-between text-[16px] font-semibold text-[#7e7e7e]">
          <span>총 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <div className="fixed bottom-0 w-full left-0 right-0 p-4 flex items-center bg-[#fff] justify-between border-t border-[#f0f0f0] rounded-[16px]">
        <div>
          <span className="text-[#2a2a2a] text-[17px] font-[500]">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="mt-2 bg-[#35CAF4] text-white text-[16px] w-[50%] py-3 rounded-[10px] font-bold flex items-center justify-center gap-1"
        >
          <span>주문하기</span>
          <div className="w-[20px] h-[20px] rounded-full bg-white text-[#35CAF4] flex items-center justify-center">
            {cartCount}
          </div>
        </button>
      </div>
    </>
  );
}
