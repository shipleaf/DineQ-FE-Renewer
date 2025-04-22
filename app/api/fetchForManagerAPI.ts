import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchOrdersInProgress = async () => {
  const response = await axios.get(
    `${apiUrl}/api/v1/store/orders?status=requested`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchOrdersInCooking = async () => {
  const response = await axios.get(
    `${apiUrl}/api/v1/store/orders?status=cooking`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchOrdersInReady = async () => {
  const response = await axios.get(
    `${apiUrl}/api/v1/store/orders?status=completed`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const putOrdersToCooking = async (orderIds: number[]) => {
  const response = await axios.put(
    `${apiUrl}/api/v1/store/orders/accept`,
    {
      orderId: orderIds,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const putCookingToReady = async (orderIds: number[]) => {
  const response = await axios.put(
    `${apiUrl}/api/v1/store/orders/complete`,
    {
      orderId: orderIds,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteSelectedOrders = async (orderId: number) => {
  const response = await axios.delete(
    `${apiUrl}/api/v1/store/orders/one/${orderId}/cancel`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteAllOrders = async (groupNum: number) => {
  const response = await axios.delete(
    `${apiUrl}/api/v1/store/orders/one/${groupNum}/cancel`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
