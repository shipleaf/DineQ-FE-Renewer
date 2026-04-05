import axios from "axios";
import { validateOrderSession } from "@/app/api/validateOrderSessionAPI";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const params = { tableId: "3", token: "test-token-abc" };

describe("validateOrderSession", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("HTTP 200 응답이면 true를 반환한다", async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });

    const result = await validateOrderSession(params);

    expect(result).toBe(true);
  });

  it("HTTP 201 등 200 외 성공 응답이면 false를 반환한다", async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 201, data: {} });

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("HTTP 501 에러(세션 이미 존재)이면 true를 반환한다", async () => {
    const axiosError = { response: { status: 501 } };
    mockedAxios.isAxiosError.mockReturnValueOnce(true);
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    const result = await validateOrderSession(params);

    expect(result).toBe(true);
  });

  it("HTTP 401 에러이면 false를 반환한다", async () => {
    const axiosError = { response: { status: 401 } };
    mockedAxios.isAxiosError.mockReturnValueOnce(true);
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("HTTP 403 에러이면 false를 반환한다", async () => {
    const axiosError = { response: { status: 403 } };
    mockedAxios.isAxiosError.mockReturnValueOnce(true);
    mockedAxios.post.mockRejectedValueOnce(axiosError);

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("네트워크 에러 등 non-axios 에러이면 false를 반환한다", async () => {
    mockedAxios.isAxiosError.mockReturnValueOnce(false);
    mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("올바른 URL과 헤더로 요청이 전송된다", async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });

    await validateOrderSession(params);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/orders"),
      { tableId: 3 },
      expect.objectContaining({
        headers: { token: "test-token-abc", tableid: "3" },
        withCredentials: true,
      })
    );
  });
});
