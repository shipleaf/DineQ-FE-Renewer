import { apiClient, API_BASE } from "@/app/api/lib/apiClient";
import type { Menu } from "@/app/type/menu/menu";
import type {
  UpdateMenuPayload,
  MenuPriorityPayload,
  NewMenuPayload,
  UpdateMenuFormPayload,
} from "./menu.type";

export const fetchAllMenus = () =>
  apiClient.get<Menu[]>("/menus").then((r) => r.data);

export const fetchMenuById = (menuId: number) =>
  apiClient.get<Menu>(`/menus/${menuId}`).then((r) => r.data);

export const submitNewMenu = async (
  menuData: NewMenuPayload,
  imageFile?: File
) => {
  const formData = new FormData();
  formData.append("menu", JSON.stringify(menuData));
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/store/menus`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) throw new Error("메뉴 등록 실패");
  return res;
};

export const submitMenuUpdate = async (
  menuId: number,
  menuData: UpdateMenuFormPayload,
  imageFile?: File
) => {
  const formData = new FormData();
  formData.append("menu", JSON.stringify(menuData));
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/store/menus/${menuId}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) throw new Error("업데이트 실패");
  return res;
};

export const updateMenu = (menu_id: number, menu: UpdateMenuPayload) =>
  apiClient.put(`/store/menus/${menu_id}`, menu).then((r) => r.data);

export const deleteMenu = (menu_id: number) =>
  apiClient.delete(`/store/menus/${menu_id}`).then((r) => r.data);

export const updateMenuStatus = (menu_id: number, onSale: boolean) =>
  apiClient
    .put(`/store/menus/${menu_id}/available`, { on_sale: onSale })
    .then((r) => r.data);

export const updateMenuPriority = (payload: MenuPriorityPayload) =>
  apiClient.put("/store/menus/sort", payload).then((r) => r.data);
