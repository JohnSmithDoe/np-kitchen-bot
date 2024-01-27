export interface Item {
  ean: string;
  name: string;

  price?: number;
  desc?: string;
}

export interface ShoppingCartItem {
  item: Item;
  quantity: number;
}

export interface ShoppingCart {
  items: ShoppingCartItem[];
}

export type NPIonDragEvent = CustomEvent<{amount: number, ratio: number}>
