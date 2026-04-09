import { FaArrowLeft } from "react-icons/fa6";

type CartHeaderProps = {
  onBack: () => void;
};

export default function CartHeader({ onBack }: CartHeaderProps) {
  return (
    <>
      <div className="p-4 py-6 grid grid-cols-5 items-center">
        <button onClick={onBack} aria-label="뒤로가기">
          <FaArrowLeft color="#2a2a2a" size={20} />
        </button>
        <span className="text-lg font-bold col-span-3 text-center text-[#2a2a2a]">
          장바구니
        </span>
        <div></div>
      </div>
      <div className="bg-[#f0f0f0] h-[2px] w-full"></div>
    </>
  );
}
