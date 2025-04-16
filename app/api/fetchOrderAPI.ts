import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type OrderRequest = {
  tableId: number;
  orders: {
    menuId: number;
    quantity: number;
  }[];
};

export const createOrders = async (
  orderData: OrderRequest,
  token: string,
  tableId: string
) => {
  const response = await axios.post(`${apiUrl}/api/v1/orders`, orderData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      token,
      tableId,
    },
  });

  return response.data;
};

export const fetchOrders = async (tableId: string) => {
  const response = await axios.get(`${apiUrl}/api/v1/orders/${tableId}`, {
    withCredentials: true,
  });
  return response;
};
