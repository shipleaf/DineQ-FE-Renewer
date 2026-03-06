type MenuListErrorOverlayProps = {
  onRetry: () => void;
};

export default function MenuListErrorOverlay({
  onRetry,
}: MenuListErrorOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110]">
      <div className="bg-white rounded-xl p-6 w-[90vw] max-w-md shadow-xl text-center space-y-4">
        <h2 className="text-lg font-bold text-[#2a2a2a]">데이터 로드 실패</h2>
        <p className="text-sm text-[#666]">
          문제가 발생했습니다.
          <br />
          새로고침 후 다시 시도해주세요.
        </p>
        <button
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          onClick={onRetry}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
