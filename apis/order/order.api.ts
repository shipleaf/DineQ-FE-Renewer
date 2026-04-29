import { apiClient } from "@/app/api/lib/apiClient";
import type { OrderRequest } from "./order.type";

export const createOrders = (
  orderData: OrderRequest,
  token: string,
  tableId: string,
  idempotencyKey: string
) =>
  apiClient
    .post("/orders", orderData, {
      "Content-Type": "application/json",
      token,
      tableId,
      "Idempotency-Key": idempotencyKey,
    })
    .then((r) => r.data);

export const fetchOrders = (tableId: string) =>
  apiClient.get(`/orders/${tableId}`);

export const fetchOrderHistory = (token: string, tableId: string) =>
  apiClient
    .get(`/orders/${tableId}`, undefined, {
      "Content-Type": "application/json",
      token,
      tableId,
    })
    .then((r) => r.data);

export const fetchOrdersInProgress = () =>
  apiClient.get("/store/orders", { status: "requested" }).then((r) => r.data);

export const fetchOrdersInCooking = () =>
  apiClient.get("/store/orders", { status: "cooking" }).then((r) => r.data);

export const fetchOrdersInReady = () =>
  apiClient.get("/store/orders", { status: "completed" }).then((r) => r.data);

export const putOrdersToCooking = (orderIds: number[]) =>
  apiClient
    .put("/store/orders/accept", { orderId: orderIds })
    .then((r) => r.data);

export const putCookingToReady = (orderIds: number[]) =>
  apiClient
    .put("/store/orders/complete", { orderId: orderIds })
    .then((r) => r.data);

export const deleteSelectedOrders = (orderId: number) =>
  apiClient
    .delete(`/store/orders/one/${orderId}/cancel`)
    .then((r) => r.data);

export const deleteAllOrders = (groupNum: number) =>
  apiClient
    .delete(`/store/orders/one/${groupNum}/cancel`)
    .then((r) => r.data);

export const fetchTableOrders = (table_id: number) =>
  apiClient.get(`/store/orders/${table_id}`).then((r) => r.data);
