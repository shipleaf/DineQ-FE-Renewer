import axios from "axios";
import { getTableNumber, fetchSalesHistory, fetchTotalSales } from "@/app/api/fetchForManagerAPI";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("getTableNumber", () => {
  it("응답이 number 타입이면 그대로 반환한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 5 });

    const result = await getTableNumber();

    expect(result).toBe(5);
  });

  it("응답이 { count: number } 객체이면 count 값을 반환한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { count: 8 } });

    const result = await getTableNumber();

    expect(result).toBe(8);
  });

  it("응답이 0이어도 정상 처리된다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 0 });

    const result = await getTableNumber();

    expect(result).toBe(0);
  });
});

describe("fetchSalesHistory", () => {
  it("startDate와 endDate를 yyyy-MM-dd 형식으로 URL에 포함한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    await fetchSalesHistory(new Date("2024-01-05"), new Date("2024-01-31"));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("startDate=2024-01-05"),
      expect.any(Object)
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("endDate=2024-01-31"),
      expect.any(Object)
    );
  });

  it("날짜가 한 자리 월/일이면 0-padded 형식으로 포맷된다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    await fetchSalesHistory(new Date("2024-03-05"), new Date("2024-03-09"));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("startDate=2024-03-05&endDate=2024-03-09"),
      expect.any(Object)
    );
  });
});

describe("fetchTotalSales", () => {
  it("startDate와 endDate를 yyyy-MM-dd 형식으로 URL에 포함한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });

    await fetchTotalSales(new Date("2024-12-01"), new Date("2024-12-31"));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("startDate=2024-12-01&endDate=2024-12-31"),
      expect.any(Object)
    );
  });
});
