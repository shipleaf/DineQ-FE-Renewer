import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// 전체 메뉴 조회
export const fetchAllMenus = async () => {
  const response = await axios.get(`${apiUrl}/api/v1/menus`);
  return response.data;
};

// 특정 메뉴 상세 조회
export const fetchMenuById = async (menuId: number) => {
  const response = await axios.get(`${apiUrl}/api/v1/menus/${menuId}`);
  return response.data;
};