"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MenuListContentProps } from "@/app/type/menu/menu";
import { useMenuData } from "@/app/order/hooks/useMenuData";
import { useProgressiveRender } from "@/app/order/hooks/useProgressiveRender";
import { useCategoryScroll } from "@/app/order/hooks/useCategoryScroll";
import CategoryTabBar from "./CategoryTabBar";
import MenuCard from "./MenuCard";
import MenuListLoadMoreMessage from "./MenuListLoadMoreMessage";

export default function MenuListContent({ tableId, token }: MenuListContentProps) {
  const router = useRouter();

  const { isSessionValid, sortedCategories, categoryEntries, menusByCategoryId } =
    useMenuData(tableId, token);

  const { visibleCategoryEntries, renderedCategoryCount, setRenderedCategoryCount, allRendered } =
    useProgressiveRender(categoryEntries, isSessionValid);

  const { activeCategory, categoryRefs, buttonRefs, handleCategoryButtonClick } =
    useCategoryScroll(categoryEntries, sortedCategories, renderedCategoryCount, setRenderedCategoryCount);

  useEffect(() => {
    if (!isSessionValid) {
      router.replace("/order/expiration");
    }
  }, [isSessionValid, router]);

  const handleMenuCardClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const menuId = event.currentTarget.dataset.menuId;

      if (!menuId) {
        return;
      }

      router.push(`/order/${menuId}?tableId=${tableId}&token=${token}`);
    },
    [router, tableId, token]
  );

  return (
    <div>
      <CategoryTabBar
        categoryEntries={categoryEntries}
        activeCategory={activeCategory}
        buttonRefs={buttonRefs}
        onCategoryClick={handleCategoryButtonClick}
      />

      <div className="space-y-8 pt-4">
        {visibleCategoryEntries.map(([name, id]) => {
          const categoryMenus = menusByCategoryId[id] ?? [];

          return (
            <div key={id}>
              <div
                ref={(element) => {
                  categoryRefs.current[id] = element;
                }}
                className="px-4 pb-2"
              >
                <h2 className="text-xl font-bold">{name}</h2>
              </div>
              <div className="space-y-4">
                {categoryMenus.map((menu) => (
                  <MenuCard key={menu.menuId} menu={menu} onClick={handleMenuCardClick} />
                ))}
              </div>
            </div>
          );
        })}

        {!allRendered && <MenuListLoadMoreMessage />}
      </div>
    </div>
  );
}
