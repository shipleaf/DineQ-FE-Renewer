type OrderSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function OrderSuccessModal({
  open,
  onClose,
  onConfirm,
}: OrderSuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-[80%] max-w-[360px] shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#2a2a2a] text-base font-semibold mb-4">
          주문이 완료되었습니다.
        </p>
        <p className="text-[#666] text-sm mb-6">감사합니다!</p>
        <button
          className="px-4 py-2 rounded bg-[#35CAF4] text-white font-bold w-full"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
