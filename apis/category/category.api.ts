import { apiClient } from "@/app/api/lib/apiClient";
import type { CategoryPriorityPayload, NewCategoryPayload } from "./category.type";

export const fetchCategories = () =>
  apiClient.get("/store/categories").then((r) => r.data);

export const submitCategorySort = (payload: CategoryPriorityPayload) =>
  apiClient.put("/store/categories/sort", payload).then((r) => r.data);

export const updateCategoryName = (categoryId: number, newName: string) =>
  apiClient.put(`/store/categories/${categoryId}`, { categoryName: newName });

export const createNewCategory = (newCategory: NewCategoryPayload) =>
  apiClient.post("/store/categories", newCategory).then((r) => r.data);
