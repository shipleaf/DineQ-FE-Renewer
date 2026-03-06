import axios from "axios";
import type { Menu } from "@/app/type/menu/menu";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllMenus = async (): Promise<Menu[]> => {
  const response = await axios.get(`${apiUrl}/api/v1/menus`, {
    withCredentials: true,
  });

  return response.data as Menu[];
};

export const fetchMenuById = async (menuId: number): Promise<Menu> => {
  const response = await axios.get(`${apiUrl}/api/v1/menus/${menuId}`, {
    withCredentials: true,
  });

  return response.data as Menu;
};
