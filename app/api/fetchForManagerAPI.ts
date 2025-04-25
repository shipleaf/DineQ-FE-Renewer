import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type CategoryPriorityPayload = {
  priorities: {
    categoryId: number;
    categoryPriority: number;
  }[];
};

export type updateMenuType = {
  menuName: string;
  menuPrice: number;
  menuInfo: string;
  menuImage: string;
};

export type MenuPriorityPayload = {
  priorities: {
    menuId: number;
    menuPriority: number;
  }[];
};

export type newCategoryType = {
  categoryName: string;
  categoryDesc: string;
};

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

export const updateMenuInfo = async (menu_id: number) => {
  const response = await axios.put(`${apiUrl}/api/v1/store/menus/${menu_id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteMenuInfo = async (menu_id: number) => {
  const response = await axios.delete(
    `${apiUrl}/api/v1/store/menus/${menu_id}}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchCatergories = async () => {
  const response = await axios.get(`${apiUrl}/api/v1/store/categories`, {
    withCredentials: true,
  });
  return response.data;
};

export const submitCategorySort = async (payload: CategoryPriorityPayload) => {
  const response = await axios.put(
    `${apiUrl}/api/v1/store/categories/sort`,
    payload,
    { withCredentials: true }
  );
  return response.data;
};

export const updateCategoryName = async (
  categoryId: number,
  newName: string
) => {
  await axios.put(
    `${apiUrl}/api/v1/store/categories/${categoryId}`,
    {
      categoryName: newName,
    },
    {
      withCredentials: true,
    }
  );
};

export const updateMenu = async (menu_id: number, menu: updateMenuType) => {
  const response = await axios.put(
    `${apiUrl}/api/v1/store/menus/${menu_id}`,
    menu,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export async function submitMenuUpdate(
  menuId: number,
  menuData: {
    menuName: string;
    menuPrice: number;
    menuInfo: string;
    categoryId: number;
  },
  imageFile?: File
) {
  const formData = new FormData();
  formData.append("menu", JSON.stringify(menuData));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${apiUrl}/api/v1/store/menus/${menuId}`, {
    method: "PUT",
    body: formData,
    credentials: "include", // ✅ withCredentials: true에 해당
  });

  if (!res.ok) throw new Error("업데이트 실패");
  return res.json();
}

export async function submitNewMenu(
  menuData: {
    menuName: string;
    menuInfo: string;
    menuPrice: number;
    categoryId: number;
    onSale: true;
  },
  imageFile?: File
) {
  const formData = new FormData();
  formData.append("menu", JSON.stringify(menuData));
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${apiUrl}/api/v1/store/menus`, {
    method: "POST",
    body: formData,
    credentials: "include", // withCredentials:true 대응
  });

  if (!res.ok) throw new Error("메뉴 등록 실패");
  return res.json();
}

export const deleteMenu = async (menu_id: number) => {
  const response = await axios.delete(
    `${apiUrl}/api/v1/store/menus/${menu_id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateMenuStatus = async (menu_id: number, onSale: boolean) => {
  const response = await axios.put(
    `${apiUrl}/api/v1/store/menus/${menu_id}/available`,
    { on_sale: onSale },
    { withCredentials: true }
  );
  return response.data;
};

export const updateMenuPriority = async (payload: MenuPriorityPayload) => {
  const response = await axios.put(
    `${apiUrl}/api/v1/store/menus/sort`,
    payload,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const createNewCategory = async (newCategory: newCategoryType) => {
  const response = await axios.post(
    `${apiUrl}/api/v1/store/categories`,
    newCategory,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchTableOrders = async (table_id: number) => {
  const response = await axios.get(
    `${apiUrl}/api/v1/store/orders/${table_id}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const payingTableOrders = async (table_id: number) => {
  const response = await axios.post(
    `${apiUrl}/api/v1/store/tables/${table_id}/clear`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const addTable = async () => {
  const res = await fetch(`${apiUrl}/api/v1/store/tables/add`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const deleteTable = async () => {
  const res = await fetch(`${apiUrl}/api/v1/store/tables/delete`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const getTableNumber = async () => {
  const response = await axios.get(`${apiUrl}/api/v1/store/tables/count`, {
    withCredentials: true,
  });
  return typeof response.data === "number" ? response.data : response.data.count;
};
