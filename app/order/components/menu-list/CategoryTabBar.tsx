import React from "react";
import type { CategoryEntry } from "@/app/type/menu/menu";

type CategoryTabBarProps = {
  categoryEntries: CategoryEntry[];
  activeCategory: number | null;
  buttonRefs: React.MutableRefObject<Record<number, HTMLButtonElement | null>>;
  onCategoryClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function CategoryTabBar({
  categoryEntries,
  activeCategory,
  buttonRefs,
  onCategoryClick,
}: CategoryTabBarProps) {
  return (
    <div className="category sticky top-0 z-0 bg-white h-20 sticky-header p-4">
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory scroll-smooth">
        {categoryEntries.map(([name, id]) => (
          <button
            key={id}
            ref={(element) => {
              buttonRefs.current[id] = element;
            }}
            data-category-id={id}
            onClick={onCategoryClick}
            className={`px-4 py-2 text-sm font-bold rounded-[999px] w-fit snap-start ${
              activeCategory === id
                ? "bg-blue-700 text-white"
                : "bg-white text-[#2a2a2a] border border-[#f0f0f0]"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
