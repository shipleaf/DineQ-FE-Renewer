export type UpdateMenuPayload = {
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

export type NewMenuPayload = {
  menuName: string;
  menuInfo: string;
  menuPrice: number;
  categoryId: number;
  onSale: true;
};

export type UpdateMenuFormPayload = {
  menuName: string;
  menuPrice: number;
  menuInfo: string;
  categoryId: number;
};
