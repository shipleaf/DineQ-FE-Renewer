"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMenus } from "@/app/api/fetchMenuAPI";
import { validateOrderSession } from "@/app/api/validateOrderSessionAPI";
import type { CategoryEntry, Menu, MenusByCategoryId } from "@/app/type/menu/menu";
import MenuListErrorOverlay from "./menu-list/MenuListErrorOverlay";
import MenuListLoadMoreMessage from "./menu-list/MenuListLoadMoreMessage";
import MenuListLoadingOverlay from "./menu-list/MenuListLoadingOverlay";

const INITIAL_CATEGORY_RENDER_COUNT = 2;
const CATEGORY_RENDER_BATCH_SIZE = 2;
const CATEGORY_RENDER_INTERVAL_MS = 120;

export default function MenuList() {
  const { data, isLoading, isError } = useQuery<Menu[]>({
    queryKey: ["menus"],
    queryFn: fetchAllMenus,
    retry: 2,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const menus = useMemo<Menu[]>(() => data ?? [], [data]);

  const categoryRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const pendingScrollCategoryRef = useRef<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  const [isValidToken, setIsValidToken] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [renderedCategoryCount, setRenderedCategoryCount] = useState(
    INITIAL_CATEGORY_RENDER_COUNT
  );

  const { sortedCategories, categoryEntries, menusByCategoryId } = useMemo(() => {
    const categoryMap = new Map<string, { id: number; priority: number }>();
    const groupedMenus: MenusByCategoryId = {};

    for (const menu of menus) {
      categoryMap.set(menu.categoryName, {
        id: menu.categoryId,
        priority: menu.categoryPriority,
      });

      if (menu.onSale) {
        (groupedMenus[menu.categoryId] ??= []).push(menu);
      }
    }

    const sorted = Array.from(categoryMap.entries()).sort(
      (a, b) => a[1].priority - b[1].priority
    );

    const entries: CategoryEntry[] = sorted.map(([name, { id }]) => [name, id]);

    return {
      sortedCategories: sorted,
      categoryEntries: entries,
      menusByCategoryId: groupedMenus,
    };
  }, [menus]);

  const visibleCategoryEntries = useMemo(
    () => categoryEntries.slice(0, renderedCategoryCount),
    [categoryEntries, renderedCategoryCount]
  );

  useEffect(() => {
    if (!token || !tableId) {
      router.replace("/order/expiration");
      return;
    }

    const validateToken = async () => {
      const isSessionValid = await validateOrderSession({ tableId, token });

      if (isSessionValid) {
        setIsValidToken(true);
      } else {
        router.replace("/order/expiration");
      }
    };

    void validateToken();
  }, [router, tableId, token]);

  useEffect(() => {
    if (isLoading || !isValidToken) {
      return;
    }

    setRenderedCategoryCount(
      Math.min(INITIAL_CATEGORY_RENDER_COUNT, categoryEntries.length)
    );
  }, [categoryEntries.length, isLoading, isValidToken]);

  useEffect(() => {
    if (isLoading || !isValidToken) {
      return;
    }

    if (renderedCategoryCount >= categoryEntries.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRenderedCategoryCount((prev) =>
        Math.min(prev + CATEGORY_RENDER_BATCH_SIZE, categoryEntries.length)
      );
    }, CATEGORY_RENDER_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [categoryEntries.length, isLoading, isValidToken, renderedCategoryCount]);

  useEffect(() => {
    if (
      !isLoading &&
      isValidToken &&
      menus.length > 0 &&
      activeCategory === null &&
      sortedCategories.length > 0
    ) {
      setActiveCategory(sortedCategories[0][1].id);
    }
  }, [activeCategory, isLoading, isValidToken, menus.length, sortedCategories]);

  const performScrollToCategory = useCallback((categoryId: number) => {
    const targetElement = categoryRefs.current[categoryId];
    const buttonElement = buttonRefs.current[categoryId];
    const stickyHeader = document.querySelector(".sticky-header");

    if (!targetElement) {
      return;
    }

    const headerHeight = stickyHeader ? stickyHeader.clientHeight : 80;
    const offset = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top: offset, behavior: "smooth" });
    setActiveCategory(categoryId);

    if (buttonElement?.offsetLeft !== undefined) {
      buttonElement.parentElement?.scrollTo({
        left: buttonElement.offsetLeft - 8,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToCategory = useCallback(
    (categoryId: number) => {
      const targetIndex = categoryEntries.findIndex(([, id]) => id === categoryId);

      if (targetIndex > -1 && targetIndex + 1 > renderedCategoryCount) {
        pendingScrollCategoryRef.current = categoryId;
        setRenderedCategoryCount((prev) => Math.max(prev, targetIndex + 1));
        setActiveCategory(categoryId);
        return;
      }

      performScrollToCategory(categoryId);
    },
    [categoryEntries, performScrollToCategory, renderedCategoryCount]
  );

  const handleCategoryButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const categoryId = Number(event.currentTarget.dataset.categoryId);

      if (Number.isNaN(categoryId)) {
        return;
      }

      scrollToCategory(categoryId);
    },
    [scrollToCategory]
  );

  const handleMenuCardClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const menuId = event.currentTarget.dataset.menuId;

      if (!menuId || !tableId || !token) {
        return;
      }

      router.push(`/order/${menuId}?tableId=${tableId}&token=${token}`);
    },
    [router, tableId, token]
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const pendingCategoryId = pendingScrollCategoryRef.current;

    if (pendingCategoryId === null || !categoryRefs.current[pendingCategoryId]) {
      return;
    }

    pendingScrollCategoryRef.current = null;
    requestAnimationFrame(() => {
      performScrollToCategory(pendingCategoryId);
    });
  }, [performScrollToCategory, renderedCategoryCount]);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = document.querySelector(".sticky-header")?.clientHeight || 80;
      const scrollTop = window.scrollY + headerHeight + 1;

      let currentCategory: number | null = null;

      for (const [, { id }] of sortedCategories) {
        const element = categoryRefs.current[id];

        if (element && scrollTop >= element.offsetTop) {
          currentCategory = id;
        }
      }

      if (currentCategory !== null && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);

        const button = buttonRefs.current[currentCategory];
        if (button?.offsetLeft !== undefined) {
          button.parentElement?.scrollTo({
            left: button.offsetLeft - 8,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, sortedCategories]);

  const isStillLoading = isLoading || !isValidToken;

  return (
    <div>
      {isError && <MenuListErrorOverlay onRetry={handleRetry} />}
      {isStillLoading && <MenuListLoadingOverlay />}

      <div className="category sticky top-0 z-0 bg-white h-20 sticky-header p-4">
        {isStillLoading ? null : (
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {categoryEntries.map(([name, id]) => (
              <button
                key={id}
                ref={(element) => {
                  buttonRefs.current[id] = element;
                }}
                data-category-id={id}
                onClick={handleCategoryButtonClick}
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
        )}
      </div>

      <div className="space-y-8 pt-4">
        {isStillLoading
          ? [1, 2].map((category) => (
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
            ))
          : visibleCategoryEntries.map(([name, id]) => {
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
                      <div
                        key={menu.menuId}
                        data-menu-id={menu.menuId}
                        onClick={handleMenuCardClick}
                      >
                        <div className="p-6 bg-white flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold break-words">{menu.menuName}</h3>
                            <p className="text-sm font-semibold mt-2">
                              {menu.menuPrice?.toLocaleString()} 원
                            </p>
                          </div>
                          <div className="w-[140px] h-[100px] rounded-[10px] overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <Image
                              src={menu.menuImage || "/DineQLogo.png"}
                              alt=""
                              width={140}
                              height={100}
                              className="w-full h-full object-cover"
                              sizes="(max-width: 768px) 140px, 140px"
                            />
                          </div>
                        </div>
                        <div className="bg-[#F0F0F0] h-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

        {!isStillLoading && renderedCategoryCount < categoryEntries.length && (
          <MenuListLoadMoreMessage />
        )}
      </div>
    </div>
  );
}
