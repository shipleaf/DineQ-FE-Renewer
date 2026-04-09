export default function CartLoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50">
      <div className="loader w-[48px] h-[48px]"></div>
    </div>
  );
}
