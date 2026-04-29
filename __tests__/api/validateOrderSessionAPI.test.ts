import axios from "axios";
import { apiClient } from "@/app/api/lib/apiClient";
import { validateOrderSession } from "@/app/api/auth/auth.api";

jest.mock("@/app/api/lib/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedPost = jest.mocked(apiClient.post);

const params = { tableId: "3", token: "test-token-abc" };

describe("validateOrderSession", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("HTTP 200 응답이면 true를 반환한다", async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: {} } as never);

    const result = await validateOrderSession(params);

    expect(result).toBe(true);
  });

  it("HTTP 201 등 200 외 성공 응답이면 false를 반환한다", async () => {
    mockedPost.mockResolvedValueOnce({ status: 201, data: {} } as never);

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("HTTP 501 에러(세션 이미 존재)이면 true를 반환한다", async () => {
    const axiosError = { response: { status: 501 } };
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
    mockedPost.mockRejectedValueOnce(axiosError);

    const result = await validateOrderSession(params);

    expect(result).toBe(true);
  });

  it("HTTP 401 에러이면 false를 반환한다", async () => {
    const axiosError = { response: { status: 401 } };
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
    mockedPost.mockRejectedValueOnce(axiosError);

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("HTTP 403 에러이면 false를 반환한다", async () => {
    const axiosError = { response: { status: 403 } };
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(true);
    mockedPost.mockRejectedValueOnce(axiosError);

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("네트워크 에러 등 non-axios 에러이면 false를 반환한다", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValueOnce(false);
    mockedPost.mockRejectedValueOnce(new Error("Network Error"));

    const result = await validateOrderSession(params);

    expect(result).toBe(false);
  });

  it("올바른 URL과 헤더로 요청이 전송된다", async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: {} } as never);

    await validateOrderSession(params);

    expect(mockedPost).toHaveBeenCalledWith(
      "/orders",
      { tableId: 3 },
      { token: "test-token-abc", tableid: "3" }
    );
  });
});
