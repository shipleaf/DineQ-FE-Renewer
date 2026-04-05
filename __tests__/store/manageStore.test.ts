import { useOrderFilterStore, useOrderStatusStore } from "@/store/manageStore";

beforeEach(() => {
  useOrderFilterStore.setState({
    showInProgress: true,
    showCooking: true,
    showReady: true,
  });
  useOrderStatusStore.setState({
    cookingUpdated: false,
    inProgressUpdated: true,
    readyUpdated: false,
  });
});

describe("useOrderFilterStore", () => {
  describe("초기 상태", () => {
    it("세 필터가 모두 true로 초기화된다", () => {
      const { showInProgress, showCooking, showReady } = useOrderFilterStore.getState();

      expect(showInProgress).toBe(true);
      expect(showCooking).toBe(true);
      expect(showReady).toBe(true);
    });
  });

  describe("toggleFilter", () => {
    it("showInProgress를 토글하면 false가 된다", () => {
      useOrderFilterStore.getState().toggleFilter("showInProgress");

      expect(useOrderFilterStore.getState().showInProgress).toBe(false);
    });

    it("두 번 토글하면 다시 true가 된다", () => {
      useOrderFilterStore.getState().toggleFilter("showCooking");
      useOrderFilterStore.getState().toggleFilter("showCooking");

      expect(useOrderFilterStore.getState().showCooking).toBe(true);
    });

    it("showInProgress 토글이 showCooking, showReady에 영향을 주지 않는다", () => {
      useOrderFilterStore.getState().toggleFilter("showInProgress");
      const { showCooking, showReady } = useOrderFilterStore.getState();

      expect(showCooking).toBe(true);
      expect(showReady).toBe(true);
    });

    it("showReady를 토글하면 false가 된다", () => {
      useOrderFilterStore.getState().toggleFilter("showReady");

      expect(useOrderFilterStore.getState().showReady).toBe(false);
    });
  });
});

describe("useOrderStatusStore", () => {
  describe("초기 상태", () => {
    it("cookingUpdated는 false로 초기화된다", () => {
      expect(useOrderStatusStore.getState().cookingUpdated).toBe(false);
    });

    it("inProgressUpdated는 true로 초기화된다", () => {
      expect(useOrderStatusStore.getState().inProgressUpdated).toBe(true);
    });

    it("readyUpdated는 false로 초기화된다", () => {
      expect(useOrderStatusStore.getState().readyUpdated).toBe(false);
    });
  });

  describe("setCookingUpdated", () => {
    it("true로 설정한다", () => {
      useOrderStatusStore.getState().setCookingUpdated(true);

      expect(useOrderStatusStore.getState().cookingUpdated).toBe(true);
    });

    it("false로 되돌린다", () => {
      useOrderStatusStore.getState().setCookingUpdated(true);
      useOrderStatusStore.getState().setCookingUpdated(false);

      expect(useOrderStatusStore.getState().cookingUpdated).toBe(false);
    });
  });

  describe("setInProgressUpdated / setReadyUpdated", () => {
    it("setInProgressUpdated(false)로 상태를 변경한다", () => {
      useOrderStatusStore.getState().setInProgressUpdated(false);

      expect(useOrderStatusStore.getState().inProgressUpdated).toBe(false);
    });

    it("setReadyUpdated(true)로 상태를 변경한다", () => {
      useOrderStatusStore.getState().setReadyUpdated(true);

      expect(useOrderStatusStore.getState().readyUpdated).toBe(true);
    });
  });
});
