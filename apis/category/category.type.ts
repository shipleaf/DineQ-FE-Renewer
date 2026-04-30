export type CategoryPriorityPayload = {
  priorities: {
    categoryId: number;
    categoryPriority: number;
  }[];
};

export type NewCategoryPayload = {
  categoryName: string;
  categoryDesc: string;
};
