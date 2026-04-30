import { apiClient } from "@/app/api/lib/apiClient";
import { getTableNumber } from "@/app/api/table/table.api";
import { fetchSalesHistory, fetchTotalSales } from "@/app/api/report/report.api";

jest.mock("@/app/api/lib/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedGet = jest.mocked(apiClient.get);

afterEach(() => {
  jest.clearAllMocks();
});

describe("getTableNumber", () => {
  it("응답이 number 타입이면 그대로 반환한다", async () => {
    mockedGet.mockResolvedValueOnce({ data: 5 } as never);

    const result = await getTableNumber();

    expect(result).toBe(5);
  });

  it("응답이 { count: number } 객체이면 count 값을 반환한다", async () => {
    mockedGet.mockResolvedValueOnce({ data: { count: 8 } } as never);

    const result = await getTableNumber();

    expect(result).toBe(8);
  });

  it("응답이 0이어도 정상 처리된다", async () => {
    mockedGet.mockResolvedValueOnce({ data: 0 } as never);

    const result = await getTableNumber();

    expect(result).toBe(0);
  });
});

describe("fetchSalesHistory", () => {
  it("startDate와 endDate를 yyyy-MM-dd 형식으로 params에 포함한다", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] } as never);

    await fetchSalesHistory(new Date("2024-01-05"), new Date("2024-01-31"));

    expect(mockedGet).toHaveBeenCalledWith(
      "/store/reports/menu-sales",
      expect.objectContaining({ startDate: "2024-01-05", endDate: "2024-01-31" })
    );
  });

  it("날짜가 한 자리 월/일이면 0-padded 형식으로 포맷된다", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] } as never);

    await fetchSalesHistory(new Date("2024-03-05"), new Date("2024-03-09"));

    expect(mockedGet).toHaveBeenCalledWith(
      "/store/reports/menu-sales",
      expect.objectContaining({ startDate: "2024-03-05", endDate: "2024-03-09" })
    );
  });
});

describe("fetchTotalSales", () => {
  it("startDate와 endDate를 yyyy-MM-dd 형식으로 params에 포함한다", async () => {
    mockedGet.mockResolvedValueOnce({ data: {} } as never);

    await fetchTotalSales(new Date("2024-12-01"), new Date("2024-12-31"));

    expect(mockedGet).toHaveBeenCalledWith(
      "/store/reports/sales",
      expect.objectContaining({ startDate: "2024-12-01", endDate: "2024-12-31" })
    );
  });
});
