import { renderHook, act } from "@testing-library/react";
import { useProgressiveRender } from "@/app/order/hooks/useProgressiveRender";
import type { CategoryEntry } from "@/app/type/menu/menu";

const makeEntries = (count: number): CategoryEntry[] =>
  Array.from({ length: count }, (_, i) => [`카테고리${i + 1}`, i + 1] as const);

describe("useProgressiveRender", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("초기 렌더 수", () => {
    it("카테고리가 5개이면 초기 renderedCategoryCount는 2다", () => {
      const entries = makeEntries(5);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, true)
      );

      expect(result.current.renderedCategoryCount).toBe(2);
    });

    it("카테고리가 1개이면 초기 renderedCategoryCount는 1이다", () => {
      const entries = makeEntries(1);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, true)
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(result.current.renderedCategoryCount).toBe(1);
    });

    it("카테고리가 없으면 renderedCategoryCount는 0이다", () => {
      const { result } = renderHook(() =>
        useProgressiveRender([], true)
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(result.current.renderedCategoryCount).toBe(0);
    });
  });

  describe("점진적 렌더링 — 타이머 기반", () => {
    it("120ms 후 renderedCategoryCount가 배치 크기(2)만큼 증가한다", () => {
      const entries = makeEntries(6);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, true)
      );

      act(() => {
        jest.advanceTimersByTime(120);
      });

      expect(result.current.renderedCategoryCount).toBe(4);
    });

    it("타이머를 여러 번 실행하면 전체 카테고리가 순차적으로 렌더된다", () => {
      const entries = makeEntries(6);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, true)
      );

      // 각 120ms 단계마다 React가 리렌더링 + 새 타이머 등록하므로 act()를 나눠서 실행
      for (let i = 0; i < 5; i++) {
        act(() => {
          jest.advanceTimersByTime(120);
        });
      }

      expect(result.current.renderedCategoryCount).toBe(6);
    });

    it("모든 카테고리가 렌더되면 allRendered가 true다", () => {
      const entries = makeEntries(3);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, true)
      );

      for (let i = 0; i < 5; i++) {
        act(() => {
          jest.advanceTimersByTime(120);
        });
      }

      expect(result.current.allRendered).toBe(true);
    });
  });

  describe("isSessionValid=false 일 때", () => {
    it("타이머가 동작하지 않아 renderedCategoryCount가 초기값을 유지한다", () => {
      const entries = makeEntries(6);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, false)
      );

      act(() => {
        jest.runAllTimers();
      });

      // isSessionValid=false 이면 effect가 early return — 초기값 2 유지
      expect(result.current.renderedCategoryCount).toBe(2);
    });

    it("isSessionValid=false 이면 allRendered가 false다", () => {
      const entries = makeEntries(6);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, false)
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(result.current.allRendered).toBe(false);
    });
  });

  describe("visibleCategoryEntries", () => {
    it("renderedCategoryCount만큼 잘라낸 entries를 반환한다", () => {
      const entries = makeEntries(5);
      const { result } = renderHook(() =>
        useProgressiveRender(entries, true)
      );

      // 초기 2개
      expect(result.current.visibleCategoryEntries).toHaveLength(2);
      expect(result.current.visibleCategoryEntries[0]).toEqual(["카테고리1", 1]);
    });
  });
});
