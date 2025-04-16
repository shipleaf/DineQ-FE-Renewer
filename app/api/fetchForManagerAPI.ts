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
