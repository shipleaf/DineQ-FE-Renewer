import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const logout = async () => {
  const response = await axios.get(`${apiUrl}/api/v1/logout`, {
    withCredentials: true,
  });
  return response.data;
};
