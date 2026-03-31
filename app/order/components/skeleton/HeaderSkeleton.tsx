export default function HeaderSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center h-full gap-1 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="w-12 h-4 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2 h-full animate-pulse">
            <div className="w-8 h-6 bg-gray-200 rounded" />
            <div className="w-32 h-6 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-4">
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-16 bg-gray-200 rounded-[10px] animate-pulse" />
        </div>
      </div>
      <div className="bg-[#F0F0F0] h-3" />
    </div>
  );
}
