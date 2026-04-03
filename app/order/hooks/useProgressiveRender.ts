import { useEffect, useMemo, useState } from "react";
import type { CategoryEntry } from "@/app/type/menu/menu";

const INITIAL_CATEGORY_RENDER_COUNT = 2;
const CATEGORY_RENDER_BATCH_SIZE = 2;
const CATEGORY_RENDER_INTERVAL_MS = 120;

type UseProgressiveRenderReturn = {
  visibleCategoryEntries: CategoryEntry[];
  renderedCategoryCount: number;
  setRenderedCategoryCount: React.Dispatch<React.SetStateAction<number>>;
  allRendered: boolean;
};

export function useProgressiveRender(
  categoryEntries: CategoryEntry[],
  isSessionValid: boolean
): UseProgressiveRenderReturn {
  const [renderedCategoryCount, setRenderedCategoryCount] = useState(
    INITIAL_CATEGORY_RENDER_COUNT
  );

  useEffect(() => {
    if (!isSessionValid) {
      return;
    }

    setRenderedCategoryCount(
      Math.min(INITIAL_CATEGORY_RENDER_COUNT, categoryEntries.length)
    );
  }, [categoryEntries.length, isSessionValid]);

  useEffect(() => {
    if (!isSessionValid) {
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
  }, [categoryEntries.length, isSessionValid, renderedCategoryCount]);

  const visibleCategoryEntries = useMemo(
    () => categoryEntries.slice(0, renderedCategoryCount),
    [categoryEntries, renderedCategoryCount]
  );

  return {
    visibleCategoryEntries,
    renderedCategoryCount,
    setRenderedCategoryCount,
    allRendered: renderedCategoryCount >= categoryEntries.length,
  };
}
