import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchToken = async () => {
  const response = await axios.post(`${apiUrl}/api/v1/register/QR/1`, {
    withCredentials: true,
  });
  return response;
};