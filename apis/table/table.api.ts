import { apiClient } from "@/app/api/lib/apiClient";

export const addTable = () => apiClient.post("/store/tables/add");

export const deleteTable = () => apiClient.post("/store/tables/delete");

export const getTableNumber = async () => {
  const response = await apiClient.get<number | { count: number }>(
    "/store/tables/count"
  );
  return typeof response.data === "number" ? response.data : response.data.count;
};

export const payingTableOrders = (table_id: number) =>
  apiClient
    .post(`/store/tables/${table_id}/clear`, {})
    .then((r) => r.data);
