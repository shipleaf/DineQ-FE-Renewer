type OrderConfirmModalProps = {
  open: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function OrderConfirmModal({
  open,
  isLoading,
  onConfirm,
  onCancel,
}: OrderConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[80%] max-w-[360px] shadow-xl text-center">
        <p className="text-[#2a2a2a] text-base font-semibold mb-4">
          정말 주문하시겠어요?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded bg-[#35CAF4] text-white font-bold disabled:opacity-50"
            disabled={isLoading}
            onClick={onConfirm}
          >
            확인
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-200 text-[#333]"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
