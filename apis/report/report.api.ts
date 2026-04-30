import { format } from "date-fns";
import { apiClient } from "@/app/api/lib/apiClient";

export const fetchSalesHistory = (startDate: Date, endDate: Date) =>
  apiClient
    .get("/store/reports/menu-sales", {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    })
    .then((r) => r.data);

export const fetchTotalSales = (startDate: Date, endDate: Date) =>
  apiClient
    .get("/store/reports/sales", {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    })
    .then((r) => r.data);
