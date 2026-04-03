import { useMemo } from "react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { fetchAllMenus } from "@/app/api/fetchMenuAPI";
import { validateOrderSession } from "@/app/api/validateOrderSessionAPI";
import type { CategoryEntry, MenusByCategoryId } from "@/app/type/menu/menu";

type UseMenuDataReturn = {
  isSessionValid: boolean;
  categoryEntries: CategoryEntry[];
  sortedCategories: [string, { id: number; priority: number }][];
  menusByCategoryId: MenusByCategoryId;
};

export function useMenuData(tableId: string, token: string): UseMenuDataReturn {
  const [{ data: isSessionValid }, { data: menus }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["session", tableId, token],
        queryFn: () => validateOrderSession({ tableId, token }),
      },
      {
        queryKey: ["menus"],
        queryFn: fetchAllMenus,
        retry: 2,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ] as const,
  });

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

  return { isSessionValid, sortedCategories, categoryEntries, menusByCategoryId };
}
