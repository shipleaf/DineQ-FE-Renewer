export type OrderRequest = {
  tableId: number;
  orders: {
    menuId: number;
    quantity: number;
  }[];
};
