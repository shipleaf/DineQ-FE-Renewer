export default function MenuListLoadingOverlay() {
  return (
    <div className="fixed inset-0 w-screen h-screen flex top-[45%] justify-center z-100 bg-white/50">
      <span className="loader"></span>
    </div>
  );
}
