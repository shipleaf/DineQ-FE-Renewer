export default function MenuListSkeleton() {
  return (
    <div>
      <div className="category sticky top-0 z-0 bg-white h-20 sticky-header p-4">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={`skeleton-tab-${i}`}
              className="h-9 w-16 rounded-[999px] bg-gray-200 animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>

      <div className="space-y-8 pt-4">
        {[1, 2].map((category) => (
          <div key={`skeleton-category-${category}`}>
            <div className="px-4 pb-2">
              <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={`skeleton-menu-${category}-${index}`}>
                  <div className="p-6 bg-white flex justify-between items-start animate-pulse">
                    <div className="space-y-2">
                      <div className="h-5 w-40 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="w-[140px] h-[100px] rounded-[10px] bg-gray-200" />
                  </div>
                  <div className="bg-[#F0F0F0] h-0.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
