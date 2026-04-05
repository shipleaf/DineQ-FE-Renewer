/**
 * useMenuData.ts 내부의 메뉴 데이터 변환 로직을 독립적으로 테스트합니다.
 * React Query 의존성 없이 순수 변환 함수만 검증합니다.
 */

import type { Menu } from "@/app/type/menu/menu";

// useMenuData의 useMemo 내부 변환 로직을 그대로 추출한 순수 함수
function transformMenus(menus: Menu[]) {
  const categoryMap = new Map<string, { id: number; priority: number }>();
  const groupedMenus: Record<number, Menu[]> = {};

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

  const entries = sorted.map(([name, { id }]) => [name, id] as [string, number]);

  return {
    sortedCategories: sorted,
    categoryEntries: entries,
    menusByCategoryId: groupedMenus,
  };
}

const makeMenu = (overrides: Partial<Menu> & { menuId: number }): Menu => ({
  menuId: overrides.menuId,
  menuName: overrides.menuName ?? "메뉴",
  menuPrice: overrides.menuPrice ?? 10000,
  menuInfo: overrides.menuInfo ?? "",
  menuImage: overrides.menuImage ?? "",
  imageUrl: overrides.imageUrl ?? null,
  onSale: overrides.onSale ?? true,
  categoryId: overrides.categoryId ?? 1,
  categoryName: overrides.categoryName ?? "카테고리",
  categoryPriority: overrides.categoryPriority ?? 1,
});

describe("useMenuData — 메뉴 데이터 변환 로직", () => {
  describe("카테고리 정렬", () => {
    it("categoryPriority 기준 오름차순으로 정렬된다", () => {
      const menus = [
        makeMenu({ menuId: 1, categoryId: 10, categoryName: "디저트", categoryPriority: 3 }),
        makeMenu({ menuId: 2, categoryId: 20, categoryName: "메인", categoryPriority: 1 }),
        makeMenu({ menuId: 3, categoryId: 30, categoryName: "사이드", categoryPriority: 2 }),
      ];

      const { sortedCategories } = transformMenus(menus);
      const names = sortedCategories.map(([name]) => name);

      expect(names).toEqual(["메인", "사이드", "디저트"]);
    });

    it("categoryEntries는 [name, id] 튜플 배열로 반환된다", () => {
      const menus = [
        makeMenu({ menuId: 1, categoryId: 5, categoryName: "음료", categoryPriority: 1 }),
      ];

      const { categoryEntries } = transformMenus(menus);

      expect(categoryEntries[0]).toEqual(["음료", 5]);
    });
  });

  describe("onSale 필터링", () => {
    it("onSale=false 메뉴는 menusByCategoryId에 포함되지 않는다", () => {
      const menus = [
        makeMenu({ menuId: 1, categoryId: 1, onSale: true }),
        makeMenu({ menuId: 2, categoryId: 1, onSale: false }),
      ];

      const { menusByCategoryId } = transformMenus(menus);

      expect(menusByCategoryId[1]).toHaveLength(1);
      expect(menusByCategoryId[1][0].menuId).toBe(1);
    });

    it("전체 onSale=false이면 menusByCategoryId가 비어있다", () => {
      const menus = [
        makeMenu({ menuId: 1, onSale: false }),
        makeMenu({ menuId: 2, onSale: false }),
      ];

      const { menusByCategoryId } = transformMenus(menus);

      expect(Object.keys(menusByCategoryId)).toHaveLength(0);
    });

    it("카테고리는 onSale 여부와 무관하게 sortedCategories에 포함된다", () => {
      const menus = [
        makeMenu({ menuId: 1, categoryId: 1, categoryName: "점심", onSale: false }),
      ];

      const { sortedCategories } = transformMenus(menus);

      expect(sortedCategories).toHaveLength(1);
      expect(sortedCategories[0][0]).toBe("점심");
    });
  });

  describe("카테고리별 메뉴 그룹핑", () => {
    it("동일 categoryId 메뉴들이 하나의 배열로 그룹핑된다", () => {
      const menus = [
        makeMenu({ menuId: 1, categoryId: 10, onSale: true }),
        makeMenu({ menuId: 2, categoryId: 10, onSale: true }),
        makeMenu({ menuId: 3, categoryId: 20, onSale: true }),
      ];

      const { menusByCategoryId } = transformMenus(menus);

      expect(menusByCategoryId[10]).toHaveLength(2);
      expect(menusByCategoryId[20]).toHaveLength(1);
    });

    it("동일 카테고리명이 여러 메뉴에 걸쳐 있어도 categoryMap에 단일 엔트리만 생성된다", () => {
      const menus = [
        makeMenu({ menuId: 1, categoryId: 5, categoryName: "한식", categoryPriority: 1 }),
        makeMenu({ menuId: 2, categoryId: 5, categoryName: "한식", categoryPriority: 1 }),
        makeMenu({ menuId: 3, categoryId: 5, categoryName: "한식", categoryPriority: 1 }),
      ];

      const { sortedCategories } = transformMenus(menus);

      expect(sortedCategories).toHaveLength(1);
    });
  });

  describe("빈 입력", () => {
    it("메뉴 배열이 비어있으면 모든 결과가 빈 상태다", () => {
      const { sortedCategories, categoryEntries, menusByCategoryId } = transformMenus([]);

      expect(sortedCategories).toHaveLength(0);
      expect(categoryEntries).toHaveLength(0);
      expect(Object.keys(menusByCategoryId)).toHaveLength(0);
    });
  });
});
