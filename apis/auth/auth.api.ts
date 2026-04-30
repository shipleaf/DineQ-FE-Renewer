import axios from "axios";
import { apiClient } from "@/app/api/lib/apiClient";
import type { ValidateOrderSessionParams } from "./auth.type";

export const logout = () => apiClient.get("/logout").then((r) => r.data);

export const checkLoginState = () =>
  apiClient.get("/auth/check").then((r) => r.data);

export const fetchToken = () => apiClient.post("/register/QR/3");

export const validateOrderSession = async ({
  tableId,
  token,
}: ValidateOrderSessionParams): Promise<boolean> => {
  try {
    const response = await apiClient.post(
      "/orders",
      { tableId: Number(tableId) },
      { token, tableid: tableId }
    );
    return response.status === 200;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 501;
    }
    return false;
  }
};
