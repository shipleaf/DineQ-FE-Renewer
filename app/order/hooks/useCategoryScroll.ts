import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CategoryEntry } from "@/app/type/menu/menu";

type SortedCategory = [string, { id: number; priority: number }];

type UseCategoryScrollReturn = {
  activeCategory: number | null;
  setActiveCategory: React.Dispatch<React.SetStateAction<number | null>>;
  categoryRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  buttonRefs: React.MutableRefObject<Record<number, HTMLButtonElement | null>>;
  handleCategoryButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  scrollToCategory: (categoryId: number) => void;
};

export function useCategoryScroll(
  categoryEntries: CategoryEntry[],
  sortedCategories: SortedCategory[],
  renderedCategoryCount: number,
  setRenderedCategoryCount: React.Dispatch<React.SetStateAction<number>>
): UseCategoryScrollReturn {
  const categoryRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const pendingScrollCategoryRef = useRef<number | null>(null);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);

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
    [categoryEntries, performScrollToCategory, renderedCategoryCount, setRenderedCategoryCount]
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

  // pending scroll 처리: 렌더링 완료 후 스크롤 실행
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

  // 스크롤 추적 → activeCategory 동기화
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

  return {
    activeCategory,
    setActiveCategory,
    categoryRefs,
    buttonRefs,
    handleCategoryButtonClick,
    scrollToCategory,
  };
}
