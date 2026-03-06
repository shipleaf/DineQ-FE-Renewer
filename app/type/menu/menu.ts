export type Menu = {
  categoryId: number;
  categoryName: string;
  categoryPriority: number;
  menuId: number;
  menuName: string;
  menuInfo: string;
  menuPrice: number;
  imageUrl: string | null;
  onSale: boolean;
  menuImage: string;
};

export type CategoryEntry = readonly [string, number];

export type MenusByCategoryId = Record<number, Menu[]>;
